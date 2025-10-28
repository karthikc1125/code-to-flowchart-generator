import { Router } from 'express';
import { ollamaService } from '../services/ollamaService.js';
import { readFile } from 'fs/promises';
import path from 'path';

export const ollamaRouter = Router();

// Cache RAG instructions to avoid reading file on every request
let cachedInstructions: any = null;
let lastLoadTime = 0;
const CACHE_DURATION = 60000; // 1 minute

async function getInstructions() {
  const now = Date.now();
  if (cachedInstructions && (now - lastLoadTime) < CACHE_DURATION) {
    return cachedInstructions;
  }
  
  const baseDir = path.resolve('rag/instructions');
  const instructionsRaw = await readFile(path.join(baseDir, 'rag_instructions.json'), 'utf-8').catch(() => '{}');
  cachedInstructions = JSON.parse(instructionsRaw || '{}');
  lastLoadTime = now;
  return cachedInstructions;
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

    // Load RAG instructions (cached)
    const instructions = await getInstructions();

    // Auto-detect mode if not specified
    // If input looks like code (contains common programming keywords), it's likely explanation
    // If input is a natural language request, it's likely generation
    const detectedMode = mode || detectMode(input);
    
    let prompt = '';
    
    if (detectedMode === 'explain') {
      // Enhanced CODE EXPLANATION MODE with structured prompt
      const explanationTask = instructions?.tasks?.code_explanation || {};
      const structure = explanationTask?.structure?.join(' > ') || 'Overview > Explanation > Key Concepts > Flow';
      const rules = explanationTask?.rules?.join('\n') || 'Be clear and educational';
      
      prompt = [
        'You are an expert programming instructor. Explain the following code in detail.',
        'Follow this exact structure: ' + structure,
        'Follow these rules:',
        rules,
        '',
        'Code to explain:',
        '```code',
        input,
        '```',
        '',
        'Provide a comprehensive explanation without any comments in your response, only structured markdown:'
      ].join('\n');
    } else {
      // Enhanced CODE GENERATION MODE with structured prompt
      const generationTask = instructions?.tasks?.code_generation || {};
      const rules = generationTask?.rules?.join('\n') || 'Generate clean, executable code';
      const languages = generationTask?.languages || {};
      
      prompt = [
        'You are an expert programmer. Generate clean, executable code for the following request.',
        'Follow these rules:',
        rules,
        '',
        'Language-specific guidelines:',
        JSON.stringify(languages, null, 2),
        '',
        'Request:',
        input,
        '',
        'Generate ONLY the code without any comments, explanations, or markdown formatting:'
      ].join('\n');
    }
    
    const result = await ollamaService.generate(model, prompt);
    let response = String(result?.response ?? '');
    console.log(`[RAG-Convert] Generated response length: ${response.length}`);
    
    // Clean response based on mode
    if (detectedMode === 'generate') {
      // For code generation, extract only the actual code and discard comments or plain text
      response = extractCodeFromResponse(response);
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
  
  // First, try to extract code from markdown code blocks
  const codeBlockMatch = response.match(/```[\w]*\n([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    const code = codeBlockMatch[1].trim();
    // Remove inline comments from the extracted code
    return removeInlineComments(code);
  }
  
  // If no code blocks, look for common code patterns and extract relevant parts
  const lines = response.split('\n');
  const codeLines = [];
  
  for (const line of lines) {
    // Check if line contains code-like patterns
    if (line.match(/(?:function|def|class|public|private|const|let|var|#include|import|using\s+namespace|console\.log|print\(|printf\(|scanf\(|\bif\b|\bfor\b|\bwhile\b|\breturn\b|=|{|\}|;)/)) {
      codeLines.push(line);
    }
  }
  
  // If we found code lines, process them
  if (codeLines.length > 0) {
    const code = codeLines.join('\n').trim();
    // Remove inline comments from the extracted code
    return removeInlineComments(code);
  }
  
  // Last resort: return the original response with basic cleaning
  const cleaned = response
    .replace(/```[\w]*\n/g, '')  // Remove opening code fence
    .replace(/```$/g, '')         // Remove closing code fence
    .trim();
  
  // Remove inline comments from the cleaned text
  return removeInlineComments(cleaned);
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


