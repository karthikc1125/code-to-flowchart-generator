import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Simple code to Mermaid conversion (full offline version)
function convertCodeToMermaid(code: string): string {
  const lines = code.split('\n').map(line => line.trim()).filter(Boolean);
  let mermaid = 'graph TD\n';
  let nodeCount = 0;
  const nodes: string[] = [];

  for (const line of lines) {
    nodeCount++;
    let nodeText = line;
    if (line.startsWith('if')) {
      nodeText = line.replace('if', '').replace('{', '').trim();
      nodes.push(`A${nodeCount}{${nodeText}}`);
    } else if (line.startsWith('return')) {
      nodes.push(`A${nodeCount}[${line}]`);
    } else {
      nodes.push(`A${nodeCount}[${line}]`);
    }
  }

  // Add nodes
  mermaid += nodes.join('\n') + '\n';

  // Add connections
  for (let i = 1; i < nodeCount; i++) {
    mermaid += `A${i} --> A${i + 1}\n`;
  }

  return mermaid;
}

// Handle code conversion requests
ipcMain.handle('convert-code', async (_, code: string) => {
  try {
    return convertCodeToMermaid(code);
  } catch (error) {
    console.error('Error converting code:', error);
    throw error;
  }
});

// Set development mode
process.env.NODE_ENV = 'development'; 