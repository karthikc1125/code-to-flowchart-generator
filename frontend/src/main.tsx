import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import mermaid from 'mermaid';

// Configure mermaid globally to prevent version display
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  },
  // Reduce logging
  logLevel: 3,
  // Suppress error rendering
  suppressErrorRendering: true
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);