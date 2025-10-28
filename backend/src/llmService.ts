import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import path from 'path';

export class LLMService extends EventEmitter {
  private modelPath: string = '';
  private isReady: boolean = false;
  private loadingProgress: string = '';

  constructor() {
    super();
  }

  async loadLLM(): Promise<{ status: string; message: string }> {
            try {
      // Start the Python script to load the model
      const pythonScript = path.join(process.cwd(), 'scripts', 'run_model.py');
      const modelProcess = spawn('python', [pythonScript]);

      modelProcess.stdout.on('data', (data) => {
                    const output = data.toString();
        this.loadingProgress = output;
        this.emit('loadingProgress', output);
      });

      modelProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
                });

      modelProcess.on('close', (code) => {
        if (code === 0) {
          this.isReady = true;
          this.modelPath = 'models/codellama-7b-instruct.Q4_K_M.gguf';
          this.emit('modelLoaded');
        } else {
          console.error(`Process exited with code ${code}`);
                    }
                });

      return { status: 'success', message: 'Model loading started' };
            } catch (error) {
      console.error('Error loading LLM:', error);
      throw error;
    }
  }

  getLoadingStatus(): string {
    return this.isReady ? 'ready' : 'loading';
    }

  getModelPath(): string {
    return this.modelPath;
    }

  getLoadingProgress(): string {
    return this.loadingProgress;
    }

  async streamResponse(prompt: string, callback: (data: string) => void): Promise<void> {
    if (!this.isReady) {
      throw new Error('Model not loaded');
        }

    try {
      const pythonScript = path.join(process.cwd(), 'scripts', 'run_model.py');
      const modelProcess = spawn('python', [pythonScript, '--prompt', prompt]);

      modelProcess.stdout.on('data', (data) => {
        callback(data.toString());
      });

      modelProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });

      return new Promise((resolve, reject) => {
        modelProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });
      });
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.isReady) {
      throw new Error('Model not loaded');
    }

    try {
      const pythonScript = path.join(process.cwd(), 'scripts', 'run_model.py');
      const modelProcess = spawn('python', [pythonScript, '--prompt', prompt]);

      let output = '';
      modelProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      return new Promise((resolve, reject) => {
        modelProcess.on('close', (code) => {
          if (code === 0) {
            resolve(output);
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });
      });
            } catch (error) {
      console.error('Error generating response:', error);
      throw error;
        }
    }
}

export const llmService = new LLMService(); 