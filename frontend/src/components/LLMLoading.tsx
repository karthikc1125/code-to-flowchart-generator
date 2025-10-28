import React, { useState } from 'react';
import LLMLoadTerminal from './LLMLoadTerminal';
import styles from '../styles/LLMLoading.module.css';

const LLMLoading = () => {
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [isPromptSet, setIsPromptSet] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [actionRequested, setActionRequested] = useState<'none' | 'load' | 'parse' | 'loadAndParse'>('none');

  // Handler to be called by the terminal when model is loaded
  const handleModelLoaded = () => {
    setIsModelLoaded(true);
  };

  // Handler for the Parse Initial Prompt button (below textarea)
  const handleParsePrompt = () => {
    if (!isModelLoaded) {
      setActionRequested('loadAndParse');
    } else {
      setActionRequested('parse');
    }
  };

  return (
    <div className={styles.container}>
      {!isPromptSet ? (
        <div className={styles.promptForm}>
          <h2>Set Initial Prompt</h2>
          <form onSubmit={e => { e.preventDefault(); if (initialPrompt.trim()) setIsPromptSet(true); }}>
            <textarea
              value={initialPrompt}
              onChange={(e) => setInitialPrompt(e.target.value)}
              placeholder="Enter your initial prompt here..."
              rows={5}
            />
            <button type="submit">Proceed to Code Entry</button>
          </form>
        </div>
      ) : (
        <div className={styles.terminalWrapper}>
          <div className={styles.promptAndButton}>
            <textarea
              value={initialPrompt}
              readOnly
              rows={5}
              className={styles.initialPromptTextarea}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <button
              className={styles.parsePromptButton}
              onClick={handleParsePrompt}
              style={{ marginBottom: 16 }}
              disabled={!initialPrompt || !isModelLoaded}
            >
              Parse Initial Prompt
            </button>
          </div>
          <LLMLoadTerminal
            initialPrompt={initialPrompt}
            onModelLoaded={handleModelLoaded}
            actionRequested={actionRequested}
            setActionRequested={setActionRequested}
          />
        </div>
      )}
    </div>
  );
};

export default LLMLoading; 