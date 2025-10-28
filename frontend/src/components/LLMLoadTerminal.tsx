import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import styles from '../styles/LLMLoadTerminal.module.css';

interface LLMLoadTerminalProps {
  initialPrompt?: string;
  onModelLoaded?: () => void;
  actionRequested?: 'none' | 'load' | 'parse' | 'loadAndParse';
  setActionRequested?: (v: 'none' | 'load' | 'parse' | 'loadAndParse') => void;
  parsePromptRequested?: boolean;
  setParsePromptRequested?: (v: boolean) => void;
}

const LLMLoadTerminal = ({ initialPrompt, onModelLoaded, actionRequested, setActionRequested, parsePromptRequested, setParsePromptRequested }: LLMLoadTerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelPath, setModelPath] = useState<string>('');
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (terminalRef.current && !terminal.current) {
      terminal.current = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Consolas, monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#d4d4d4',
          black: '#000000',
          red: '#cd3131',
          green: '#0dbc79',
          yellow: '#e5e510',
          blue: '#2472c8',
          magenta: '#bc3fbc',
          cyan: '#11a8cd',
          white: '#e5e5e5',
          brightBlack: '#666666',
          brightRed: '#f14c4c',
          brightGreen: '#23d18b',
          brightYellow: '#f5f543',
          brightBlue: '#3b8eea',
          brightMagenta: '#d670d6',
          brightCyan: '#29b8db',
          brightWhite: '#ffffff'
        }
      });

      fitAddonRef.current = new FitAddon();
      terminal.current.loadAddon(fitAddonRef.current);
      terminal.current.open(terminalRef.current);
      fitAddonRef.current.fit();

      // Check initial model status
      checkModelStatus();
    }

    return () => {
      terminal.current?.dispose();
      terminal.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isModelLoaded && onModelLoaded) {
      onModelLoaded();
    }
  }, [isModelLoaded, onModelLoaded]);

  useEffect(() => {
    if (!actionRequested || !setActionRequested) return;
    if (actionRequested === 'load') {
      handleLoadModel();
      setActionRequested('none');
    } else if (actionRequested === 'parse') {
      handleParsePrompt();
      setActionRequested('none');
    } else if (actionRequested === 'loadAndParse') {
      handleLoadModel(() => {
        handleParsePrompt();
      });
      setActionRequested('none');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionRequested]);

  useEffect(() => {
    if (parsePromptRequested && setParsePromptRequested) {
      handleParsePrompt();
      setParsePromptRequested(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsePromptRequested]);

  const checkModelStatus = () => {
    fetch('http://localhost:3000/api/llm/status')
      .then(response => response.json())
      .then(data => {
        setModelPath(data.modelPath);
        setIsModelLoaded(data.ready);
        if (data.ready) {
          connectToStream();
        }
      })
      .catch(err => {
        setError('Failed to connect to LLM server');
        console.error('Error checking model status:', err);
      });
  };

  const handleLoadModel = (onLoaded?: () => void) => {
    setIsLoading(true);
    setError(null);
    terminal.current?.writeln('\r\nLoading LLM model...\r\n');

    fetch('http://localhost:3000/api/llm/load', { method: 'POST' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to load model');
        // Connect to loading progress stream
        const eventSource = new EventSource('http://localhost:3000/api/llm/loading-progress');
        let streamEnded = false;
        eventSource.onmessage = (event) => {
          if (event.data && event.data.includes('event: end')) {
            streamEnded = true;
            terminal.current?.writeln('\r\n[Model loading complete]\r\n');
            eventSource.close();
            setIsLoading(false);
            setIsModelLoaded(true);
            if (onLoaded) onLoaded();
            return;
          }
          try {
            const { progress } = JSON.parse(event.data);
            terminal.current?.write(progress.replace(/\n/g, '\r\n'));
          } catch {}
        };
        eventSource.onerror = () => {
          if (!streamEnded) {
            setError('Connection lost to LLM server');
            terminal.current?.writeln('\r\nConnection lost to LLM server...\r\n');
          }
          eventSource.close();
        };
      })
      .catch(error => {
        setError('Failed to load model');
        setIsLoading(false);
      });
  };

  const handleParsePrompt = async () => {
    if (!initialPrompt) {
      setError('No initial prompt provided');
      return;
    }
    if (!isModelLoaded) {
      setError('Model not loaded. Please load the model first.');
      return;
    }
    try {
      terminal.current?.writeln(`\r\nParsing initial prompt: ${initialPrompt}\r\n`);
      const response = await fetch('http://localhost:3000/api/llm/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: initialPrompt }),
      });
      if (!response.ok) throw new Error('Failed to parse prompt');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');
      let streamEnded = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('event: end')) {
            streamEnded = true;
            terminal.current?.writeln('\r\n[Prompt parsing complete]\r\n');
            break;
          }
          if (line.startsWith('data: ')) {
            try {
              const { data } = JSON.parse(line.slice(6));
              terminal.current?.write(data.replace(/\n/g, '\r\n'));
            } catch {}
          }
        }
      }
      if (!streamEnded) {
        setError('Connection lost to LLM server');
        terminal.current?.writeln('\r\nConnection lost to LLM server...\r\n');
      }
    } catch (error) {
      setError('Failed to parse prompt');
      terminal.current?.writeln('\r\nError parsing prompt...\r\n');
    }
  };

  const connectToStream = () => {
    const eventSource = new EventSource('http://localhost:3000/api/llm/stream');
    
    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      terminal.current?.writeln('\r\nConnected to LLM server...\r\n');
    };

    eventSource.onmessage = (event) => {
      if (event.type === 'message' && event.data) {
        if (event.data.startsWith('event: end')) {
          terminal.current?.writeln('\r\n[Prompt parsing complete]\r\n');
          eventSource.close();
          return;
        }
        try {
          const { data } = JSON.parse(event.data);
          terminal.current?.write(data.replace(/\n/g, '\r\n'));
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setError('Connection lost to LLM server');
      terminal.current?.writeln('\r\nConnection lost to LLM server...\r\n');
      eventSource.close();
    };

    // Handle window resize
    const handleResize = () => {
      fitAddonRef.current?.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      eventSource.close();
      window.removeEventListener('resize', handleResize);
    };
  };

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.statusBar}>
        <div className={`${styles.statusIndicator} ${!isConnected ? styles.disconnected : ''}`} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        {modelPath && <span className={styles.modelPath}>Model: {modelPath}</span>}
      </div>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.loadButton}
          onClick={() => handleLoadModel()}
          disabled={isLoading || isModelLoaded}
        >
          {isLoading ? 'Loading...' : 'Load LLM'}
        </button>
        {isModelLoaded && (
          <button 
            className={styles.parseButton}
            onClick={handleParsePrompt}
            disabled={!initialPrompt}
          >
            Parse Initial Prompt
          </button>
        )}
      </div>
      <div ref={terminalRef} className={styles.terminal} />
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingText}>Loading LLM Model...</div>
          </div>
        </div>
      )}
      {error && !isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>{error}</div>
        </div>
      )}
    </div>
  );
};

export default LLMLoadTerminal; 