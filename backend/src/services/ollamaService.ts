import axios, { AxiosInstance } from 'axios';
import http from 'http';

export interface OllamaModelTag {
  name: string;
  model: string;
  modified?: string;
  size?: number;
  digest?: string;
}

export interface OllamaGenerateOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop?: string[];
  num_predict?: number;
  num_ctx?: number;
  repeat_penalty?: number;
  [key: string]: unknown;
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class OllamaService {
  private http: AxiosInstance;

  constructor(baseUrl?: string) {
    const base = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    // Increased timeout to 5 minutes (300,000ms) for LLM operations
    // Enable keep-alive and connection pooling for faster requests
    this.http = axios.create({ 
      baseURL: base, 
      timeout: 300_000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      httpAgent: new http.Agent({ 
        keepAlive: true, 
        keepAliveMsecs: 30000,
        maxSockets: 50,
        maxFreeSockets: 10
      })
    });
  }

  async health(): Promise<{ ok: boolean }>
  {
    try {
      await this.http.get('/api/tags');
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }

  async listModels(): Promise<OllamaModelTag[]> {
    const res = await this.http.get('/api/tags');
    // Newer Ollama returns { models: [...] }
    if (Array.isArray(res.data)) return res.data as OllamaModelTag[];
    if (res.data && Array.isArray(res.data.models)) return res.data.models as OllamaModelTag[];
    return [];
  }

  async pullModel(model: string): Promise<{ status: string }>
  {
    // API expects { model } (older versions accepted { name })
    await this.http.post('/api/pull', { model, name: model });
    return { status: 'ok' };
  }

  async generate(
    model: string,
    prompt: string,
    options?: OllamaGenerateOptions
  ): Promise<{ response: string }>
  {
    console.log(`[OllamaService] Starting generation with model: ${model}, prompt length: ${prompt.length}`);
    const startTime = Date.now();
    
    // Aggressive performance-optimized options for maximum speed
    const optimizedOptions = {
      temperature: 0.5,        // Lower for faster, more deterministic output
      top_p: 0.85,             // Tighter sampling for speed
      top_k: 30,               // Fewer token choices = faster
      num_predict: 1024,       // Shorter max output for speed
      num_ctx: 1024,           // Minimal context window
      repeat_penalty: 1.15,    // Higher to finish faster
      num_thread: 8,           // Parallel processing
      num_gpu: 1,              // Use GPU if available
      ...options               // Allow override
    };
    
    try {
      const res = await this.http.post('/api/generate', {
        model,
        prompt,
        stream: false,
        options: optimizedOptions
      });
      
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[OllamaService] Generation completed in ${elapsedTime}s`);
      
      // Response commonly includes { response, done, ... }
      return { response: res.data?.response ?? String(res.data ?? '') };
    } catch (error: any) {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.error(`[OllamaService] Generation failed after ${elapsedTime}s:`, error.message);
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error(`Ollama request timeout after ${elapsedTime}s. The model may need more time or the prompt is too complex.`);
      }
      throw error;
    }
  }

  async chat(
    model: string,
    messages: OllamaChatMessage[],
    options?: OllamaGenerateOptions
  ): Promise<{ message: OllamaChatMessage }>
  {
    const res = await this.http.post('/api/chat', {
      model,
      messages,
      stream: false,
      options: options || {}
    });
    // Response commonly includes { message: { role, content }, done, ... }
    return { message: res.data?.message ?? { role: 'assistant', content: String(res.data ?? '') } };
  }
}

export const ollamaService = new OllamaService();


