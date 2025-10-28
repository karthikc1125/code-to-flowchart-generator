const BASE_URL = 'http://localhost:3000/api/ollama';

export interface OllamaModelTag {
  name: string;
  model: string;
  modified?: string;
  size?: number;
  digest?: string;
}

export async function health(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    return Boolean(data?.ok);
  } catch {
    return false;
  }
}

export async function listModels(): Promise<OllamaModelTag[]> {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) throw new Error('Failed to list Ollama models');
  const json = await res.json();
  return Array.isArray(json?.models) ? json.models : [];
}

export async function pullModel(model: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/pull`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Failed to pull model');
  }
}

export async function generate(model: string, prompt: string): Promise<string> {
  console.log(`[Ollama Frontend] Starting generate with model: ${model}, prompt length: ${prompt.length}`);
  const startTime = Date.now();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[Ollama Frontend] Generate timeout after 5 minutes`);
    controller.abort();
  }, 300000); // 5 minutes timeout
  
  try {
    const res = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Ollama Frontend] Generate completed in ${elapsedTime}s`);
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || 'Failed to generate');
    }
    const data = await res.json();
    return String(data?.response ?? '');
  } catch (error: any) {
    clearTimeout(timeoutId);
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (error.name === 'AbortError') {
      console.error(`[Ollama Frontend] Generate aborted after ${elapsedTime}s`);
      throw new Error(`Request timeout after ${elapsedTime}s - the model is taking too long to respond. Try a smaller prompt or different model.`);
    }
    console.error(`[Ollama Frontend] Generate failed after ${elapsedTime}s:`, error.message);
    throw error;
  }
}

export async function ragConvert(model: string, input: string, mode?: 'explain' | 'generate'): Promise<string> {
  console.log(`[Ollama Frontend] Starting ragConvert with model: ${model}, mode: ${mode || 'auto'}, input length: ${input.length}`);
  const startTime = Date.now();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[Ollama Frontend] Request timeout after 5 minutes`);
    controller.abort();
  }, 300000); // 5 minutes timeout
  
  try {
    const res = await fetch(`${BASE_URL}/rag-convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input, mode }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Ollama Frontend] ragConvert completed in ${elapsedTime}s`);
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || 'Failed to rag-convert');
    }
    const data = await res.json();
    return String(data?.response ?? '');
  } catch (error: any) {
    clearTimeout(timeoutId);
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (error.name === 'AbortError') {
      console.error(`[Ollama Frontend] Request aborted after ${elapsedTime}s`);
      throw new Error(`Request timeout after ${elapsedTime}s - the model is taking too long to respond. Try a smaller prompt or different model.`);
    }
    console.error(`[Ollama Frontend] ragConvert failed after ${elapsedTime}s:`, error.message);
    throw error;
  }
}


