import { Router } from 'express';
import { ollamaService } from '../services/ollamaService.js';
import { readFile } from 'fs/promises';
import path from 'path';

export const ollamaRouter = Router();

// Cache RAG instructions to avoid reading file on every request
let cachedExplainInstructions: any = null;
let cachedGenerateInstructions: any = null;
let lastLoadTime = 0;
const CACHE_DURATION = 60000; // 1 minute

async function getInstructions(mode: 'explain' | 'generate' = 'explain') {
  const now = Date.now();
  
  // Check cache for the requested mode
  if (mode === 'generate' && cachedGenerateInstructions && (now - lastLoadTime) < CACHE_DURATION) {
    return cachedGenerateInstructions;
  }
  if (mode === 'explain' && cachedExplainInstructions && (now - lastLoadTime) < CACHE_DURATION) {
    return cachedExplainInstructions;
  }
  
  const baseDir = path.resolve('rag/instructions');
  
  if (mode === 'generate') {
    // Load code generation instructions
    const instructionsRaw = await readFile(path.join(baseDir, 'generate_code_instructions.json'), 'utf-8').catch(() => '{}');
    cachedGenerateInstructions = JSON.parse(instructionsRaw || '{}');
    lastLoadTime = now;
    return cachedGenerateInstructions;
  } else {
    // Load code explanation instructions
    const instructionsRaw = await readFile(path.join(baseDir, 'rag_instructions.json'), 'utf-8').catch(() => '{}');
    cachedExplainInstructions = JSON.parse(instructionsRaw || '{}');
    lastLoadTime = now;
    return cachedExplainInstructions;
  }
}

// Health check (verifies Ollama daemon is reachable)
ollamaRouter.get('/health', async (req, res) => {
  const status = await ollamaService.health();
  res.json(status);
});

// List available models
ollamaRouter.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

// RAG-powered AI assistant for code explanation and generation
ollamaRouter.post('/rag-convert', async (req, res) => {
  // Set extended timeout for LLM operations (5 minutes)
  req.setTimeout(300000);
  res.setTimeout(300000);
  try {
    const { model, input, mode } = req.body as { model?: string; input?: string; mode?: 'explain' | 'generate' };
    console.log(`[RAG-Convert] Received request - model: ${model}, mode: ${mode}, input length: ${input?.length || 0}`);
    if (!model) return res.status(400).json({ error: 'model is required' });
    if (!input) return res.status(400).json({ error: 'input is required' });

    // Auto-detect mode if not specified
    const detectedMode = mode || detectMode(input);
    
    // Load RAG instructions based on detected mode
    const instructions = await getInstructions(detectedMode);

    let prompt = '';
    
    if (detectedMode === 'explain') {
      // CODE EXPLANATION MODE
      const rules = instructions?.rules || [];
      const template = instructions?.template || {};
      
      prompt = [
        'You are an expert programming instructor. Explain the following code in detail.',
        '',
        'Rules:',
        ...rules.map((r: string) => `- ${r}`),
        '',
        'Code to explain:',
        '``',
        input,
        '```',
        '',
        'Provide your explanation following the template structure.'
      ].join('\n');
    } else {
      // CODE GENERATION MODE - Optimized for code models like DeepSeek-Coder
      
      prompt = [
        '### Instruction:',
        'Write code for the following task. Output only the code, no explanations.',
        '',
        '### Task:',
        input,
        '',
        '### Code:'
      ].join('\n');
    }
    
    const result = await ollamaService.generate(model, prompt, {
      temperature: 0.1,        // Very low for DeepSeek-Coder
      top_p: 0.95,
      top_k: 50,
      num_predict: 512,        // Sufficient for most code
      repeat_penalty: 1.0,     // DeepSeek-Coder handles this well
      stop: ['###', 'Instruction:', 'Task:', '\n\n\n']  // Stop at section markers or excessive newlines
    });
    let response = String(result?.response ?? '');
    console.log(`[RAG-Convert] Generated response length: ${response.length}`);
    console.log(`[RAG-Convert] First 200 chars of response: ${response.substring(0, 200)}`);
    
    // Validate response for hallucination/malformation
    const hasRepeatedCodeBlocks = (response.match(/```/g) || []).length > 6; // More than 3 code blocks
    const hasExcessiveRepetition = /(.{20,})\1{2,}/.test(response); // Same 20+ chars repeated 3+ times
    const hasGarbageSymbols = (response.match(/[;}]{3,}/g) || []).length > 0; // 3+ consecutive braces/semicolons
    
    if (hasRepeatedCodeBlocks || hasExcessiveRepetition || hasGarbageSymbols) {
      console.error('[RAG-Convert] Detected hallucinated/malformed response');
      response = '';
    }
    
    // Clean response based on mode
    if (detectedMode === 'generate') {
      // For code generation, extract the code
      response = extractCodeFromResponse(response);
      console.log(`[RAG-Convert] After extraction, code length: ${response.length}`);
      
      // If still empty after extraction, return error
      if (!response || response.trim().length === 0) {
        console.error('[RAG-Convert] Code extraction failed - AI did not return valid code');
        response = '// Error: Unable to generate valid code.\n// The AI model may not be suitable for code generation.\n// Please try:\n//   1. Using a code-focused model (e.g., codellama, deepseek-coder)\n//   2. Simplifying your request\n//   3. Being more specific about the programming language';
      }
    } else {
      // For code explanation, ensure clean markdown without extra comments
      response = response
        .replace(/^\/\/.*$/gm, '') // Remove any comment lines
        .trim();
    }
    
    console.log(`[RAG-Convert] Sending response - mode: ${detectedMode}, length: ${response.length}`);
    res.json({ response, mode: detectedMode });
  } catch (error) {
    console.error('[RAG-Convert] Error:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

// Helper function to extract only code from LLM responses
function extractCodeFromResponse(response: string): string {
  if (!response) return '';
  
  console.log('[extractCodeFromResponse] Processing response, length:', response.length);
  
  // Method 1: Try to extract code from ``` delimiters if present
  const codeBlockRegex = /```(?:[a-zA-Z0-9]+)?\s*\n([\s\S]*?)\n```/;
  const match = response.match(codeBlockRegex);
  
  if (match && match[1]) {
    const code = match[1].trim();
    
    // Validate that the code is not empty and contains actual code
    if (code.length < 10) {
      console.log('[extractCodeFromResponse] Code block too short, likely invalid');
      return '';
    }
    
    // Check if it's just repeated delimiters
    if (code.split('\n').every(line => line.trim().startsWith('```') || line.trim() === '')) {
      console.log('[extractCodeFromResponse] Code block contains only delimiters, invalid');
      return '';
    }
    
    console.log('[extractCodeFromResponse] Successfully extracted code from ``` delimiters, length:', code.length);
    return code; // Return code as-is without removing comments
  }
  
  console.log('[extractCodeFromResponse] No ``` delimiters found, treating entire response as code');
  
  // Method 2: If no delimiters, treat the entire response as code
  // This allows direct code responses without ``` wrappers
  const trimmedResponse = response.trim();
  
  // First, reject purely explanatory text (common AI mistakes)
  const hasExplanatoryPhrases = /(?:here.{0,20}is|sure.{0,20}here|this.{0,20}code|this.{0,20}program|explanation|following.{0,20}code|below.{0,20}code)/i.test(trimmedResponse);
  const hasCodeStart = /^(?:#include|import |function |def |class |public |program |var |const |let |int |void )/.test(trimmedResponse);
  
  if (hasExplanatoryPhrases && !hasCodeStart) {
    console.log('[extractCodeFromResponse] Response appears to be explanatory text, not code');
    return '';
  }
  
  // Check for malformed syntax patterns
  const hasMalformedSyntax = /(?:javascriptsriptype|parseFloat\('%[di]|'%[ip]'\)|\);\s*\}\s*console)/i.test(trimmedResponse);
  if (hasMalformedSyntax) {
    console.log('[extractCodeFromResponse] Response contains malformed syntax');
    return '';
  }
  
  // Basic validation: check if it looks like code
  const hasCodePatterns = /(?:#include|import|function|def|class|public|private|const|let|var|program|\bif\b|\bfor\b|\bwhile\b|\breturn\b|\{|\}|;)/.test(trimmedResponse);
  
  if (hasCodePatterns && trimmedResponse.length > 10) {
    console.log('[extractCodeFromResponse] Treating entire response as code, length:', trimmedResponse.length);
    return trimmedResponse;
  }
  
  // No code could be extracted
  console.log('[extractCodeFromResponse] No code could be extracted');
  return '';
}

// Helper function to remove inline comments while preserving code
function removeInlineComments(code: string): string {
  if (!code) return '';
  
  const lines = code.split('\n');
  const cleanedLines = lines.map(line => {
    // Remove Python style comments (# ...)
    // But be careful not to remove # when it might be part of a string or preprocessor directive
    const hashIndex = line.indexOf('#');
    if (hashIndex !== -1 && !line.trim().startsWith('#include')) {
      // Check if it's likely a comment (not part of a string)
      const beforeComment = line.substring(0, hashIndex);
      // If there's an even number of quotes before the #, it's likely a comment
      const singleQuoteCount = (beforeComment.match(/'/g) || []).length;
      const doubleQuoteCount = (beforeComment.match(/"/g) || []).length;
      if (singleQuoteCount % 2 === 0 && doubleQuoteCount % 2 === 0) {
        return beforeComment.trimEnd();
      }
    }
    
    // Remove C/C++/Java/JS/TS style inline comments (// ...)
    // But be careful not to remove URLs or other valid uses of //
    const doubleSlashIndex = line.indexOf('//');
    if (doubleSlashIndex !== -1) {
      // Check if it's likely a comment (not part of a URL or string)
      const beforeComment = line.substring(0, doubleSlashIndex);
      // If there's an even number of quotes before the //, it's likely a comment
      const quoteCount = (beforeComment.match(/"/g) || []).length;
      if (quoteCount % 2 === 0) {
        return beforeComment.trimEnd();
      }
    }
    
    // Remove C style inline comments (/* ... */)
    return line.replace(/\/\*.*?\*\//g, '').trimEnd();
  });
  
  return cleanedLines.join('\n');
}

// Helper function to detect if input is code (for explanation) or a request (for generation)
function detectMode(input: string): 'explain' | 'generate' {
  const lowerInput = input.toLowerCase().trim();
  
  // Code indicators - if input contains these, it's likely code to explain
  const codeIndicators = [
    'function', 'def ', 'class ', 'import ', 'include', '#include',
    'public ', 'private ', 'void ', 'int ', 'return ',
    'for ', 'while ', 'if ', 'else ', 'switch ',
    'const ', 'let ', 'var ', 'printf', 'print(',
    '{', '}', '()', '=>', 'scanf', 'cout', 'cin'
  ];
  
  // Generation request indicators - if input contains these, it's likely a request
  const requestIndicators = [
    'create', 'write', 'make', 'build', 'generate', 'implement',
    'develop', 'code for', 'program to', 'function that', 'script that',
    'how to', 'can you', 'please', 'i need', 'i want'
  ];
  
  // Count matches
  const codeMatches = codeIndicators.filter(indicator => lowerInput.includes(indicator)).length;
  const requestMatches = requestIndicators.filter(indicator => lowerInput.includes(indicator)).length;
  
  // If more code indicators than request indicators, it's explanation
  // Otherwise, it's generation
  return codeMatches > requestMatches ? 'explain' : 'generate';
}

// Pull a model
ollamaRouter.post('/pull', async (req, res) => {
  try {
    const { model } = req.body as { model?: string };
    if (!model) return res.status(400).json({ error: 'model is required' });
    const ok = await ollamaService.pullModel(model);
    res.json(ok);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

// Text generation
ollamaRouter.post('/generate', async (req, res) => {
  // Set extended timeout for LLM operations (5 minutes)
  req.setTimeout(300000);
  res.setTimeout(300000);
  try {
    const { model, prompt, options } = req.body as { model?: string; prompt?: string; options?: Record<string, unknown> };
    if (!model) return res.status(400).json({ error: 'model is required' });
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    const result = await ollamaService.generate(model, prompt, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

// Chat-style interaction
ollamaRouter.post('/chat', async (req, res) => {
  // Set extended timeout for LLM operations (5 minutes)
  req.setTimeout(300000);
  res.setTimeout(300000);
  try {
    const { model, messages, options } = req.body as { model?: string; messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>; options?: Record<string, unknown> };
    if (!model) return res.status(400).json({ error: 'model is required' });
    if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages array is required' });
    const result = await ollamaService.chat(model, messages, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});


