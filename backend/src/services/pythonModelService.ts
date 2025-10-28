import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import readline from 'readline';
import { EventEmitter } from 'events';

export class PythonModelService extends EventEmitter {
  private process: ChildProcessWithoutNullStreams | null = null;
  private isReady: boolean = false;
  private loadingLogs: string[] = [];
  private promptQueue: { prompt: string, resolve: (resp: string) => void, reject: (err: any) => void }[] = [];
  private rl: readline.Interface | null = null;

  start() {
    if (this.process) return;
    // Prefer backend/scripts/run_model.py (repo structure)
    const scriptPath = path.join(process.cwd(), 'backend', 'scripts', 'run_model.py');
    this.process = spawn('python', [scriptPath]);
    this.rl = readline.createInterface({ input: this.process.stdout });

    this.process.stderr.on('data', (data) => {
      this.emit('error', data.toString());
    });

    this.process.on('close', (code) => {
      this.isReady = false;
      this.emit('exit', code);
    });

    // Listen for model loading logs
    this.rl.on('line', (line) => {
      if (!this.isReady) {
        this.loadingLogs.push(line);
        this.emit('loading', line);
        if (line.includes('Model loaded successfully')) {
          this.isReady = true;
          this.emit('ready');
        }
      } else {
        // Handle prompt responses
        const queued = this.promptQueue[0];
        if (queued) {
          this.emit('response', line); // Emit for streaming
          if (line.trim() === '') {
            queued.resolve('done');
            this.promptQueue.shift();
          }
        }
      }
    });
  }

  stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.isReady = false;
      this.loadingLogs = [];
      this.rl?.close();
      this.rl = null;
    }
  }

  async sendPrompt(prompt: string): Promise<string> {
    if (!this.process || !this.isReady) {
      throw new Error('Model is not loaded');
    }
    return new Promise((resolve, reject) => {
      this.promptQueue.push({ prompt, resolve, reject });
      this.process!.stdin.write(JSON.stringify({ prompt }) + '\n');
    });
  }

  getLoadingLogs() {
    return this.loadingLogs;
  }

  getReady() {
    return this.isReady;
  }
}

export const pythonModelService = new PythonModelService(); 