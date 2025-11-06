import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import CodeEntry from './pages/CodeEntry';
import MermaidEditor from './pages/MermaidEditor';
import Analysis from './pages/Analysis';
import WriteWithAI from './pages/WriteWithAI';
import Instructions from './pages/Instructions';
import { ThemeProvider } from './components/ThemeProvider';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/code-entry" element={<CodeEntry />} />
          <Route path="/mermaid-editor" element={<MermaidEditor />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/write-with-ai" element={<WriteWithAI />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;