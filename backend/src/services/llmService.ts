import { spawn } from 'child_process';
import path from 'path';
import { EventEmitter } from 'events';

export class LLMService extends EventEmitter {
  private modelProcess: any;
  private isModelLoaded: boolean = false;
  private loadingProgress: string = '';
  private modelPath: string;

  constructor() {
    super();
    this.modelPath = path.join(__dirname, '../../CodeLlama-7B-Instruct-GGUF/codellama-7b-instruct.Q8_0.gguf');
    this.initializeModel();
  }

  private initializeModel() {
    const scriptPath = path.join(__dirname, '../../scripts/run_model.py');
    
    // Spawn Python process with model path
    this.modelProcess = spawn('python', [scriptPath, '--model-path', this.modelPath]);

    this.modelProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      this.loadingProgress += output;
      
      // Emit loading progress
      this.emit('loadingProgress', output);
      
      // Check if model is loaded
      if (output.includes('Model loaded successfully')) {
        this.isModelLoaded = true;
        this.emit('modelLoaded');
      }
    });

    this.modelProcess.stderr.on('data', (data: Buffer) => {
      const error = data.toString();
      console.error('Model error:', error);
      this.emit('error', error);
    });

    this.modelProcess.on('close', (code: number) => {
      console.log(`Model process exited with code ${code}`);
      this.isModelLoaded = false;
      this.emit('modelClosed', code);
    });
  }

  public async generateResponse(prompt: string): Promise<string> {
    if (!this.isModelLoaded) {
      throw new Error('Model is not loaded yet');
    }

    return new Promise((resolve, reject) => {
      try {
        this.modelProcess.stdin.write(JSON.stringify({ prompt }) + '\n');
        this.modelProcess.stdout.once('data', (data: Buffer) => {
          resolve(data.toString().trim());
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async streamResponse(prompt: string, onData: (data: string) => void) {
    if (!this.isModelLoaded) {
      throw new Error('Model is not loaded yet');
    }

    try {
      this.modelProcess.stdin.write(JSON.stringify({ prompt }) + '\n');
      
      this.modelProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        onData(output);
      });
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  }

  public getLoadingProgress(): string {
    return this.loadingProgress;
  }

  public isReady(): boolean {
    return this.isModelLoaded;
  }

  public getModelPath(): string {
    return this.modelPath;
  }
} 