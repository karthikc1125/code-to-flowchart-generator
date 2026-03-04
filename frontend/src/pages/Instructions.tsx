import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCode, FiFileText, FiZap } from 'react-icons/fi';
import styles from '../styles/Welcome.module.css';

const Instructions: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/code-entry');
  };

  return (
    <div className={styles.container} style={{ height: '100vh', overflow: 'hidden', boxSizing: 'border-box' }}>
      <header className={styles.header} style={{ marginBottom: 'min(2vh, 2rem)' }}>
        <h1 className={styles.title} style={{ marginBottom: 'min(1vh, 1rem)', fontSize: 'clamp(1.5rem, 4vh, 2.5rem)' }}>How to Use This Tool</h1>
        <p className={styles.subtitle} style={{ marginBottom: 'min(2vh, 2rem)', fontSize: 'clamp(1rem, 2.5vh, 1.5rem)' }}>
          Follow these simple steps to convert your code into beautiful flowcharts
        </p>
      </header>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'min(4vh, 32px)' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              background: 'rgba(0, 122, 204, 0.2)',
              border: '1px solid rgba(0, 122, 204, 0.3)',
              width: 'min(5vh, 40px)',
              height: 'min(5vh, 40px)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 'bold', color: '#007acc', fontSize: 'clamp(0.8rem, 2vh, 1rem)' }}>1</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(1.1rem, 3vh, 1.5rem)' }}>
                <FiCode />
                Enter Your Code
              </h3>
              <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5, fontSize: 'clamp(0.85rem, 2vh, 1rem)' }}>
                Paste your source code into the editor or import a file.
                Supported languages include JavaScript, TypeScript, Python, Java, C/C++.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              background: 'rgba(0, 122, 204, 0.2)',
              border: '1px solid rgba(0, 122, 204, 0.3)',
              width: 'min(5vh, 40px)',
              height: 'min(5vh, 40px)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 'bold', color: '#007acc', fontSize: 'clamp(0.8rem, 2vh, 1rem)' }}>2</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(1.1rem, 3vh, 1.5rem)' }}>
                <FiFileText />
                Select Language & Convert
              </h3>
              <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5, fontSize: 'clamp(0.85rem, 2vh, 1rem)' }}>
                Choose the correct programming language from the dropdown.
                The tool will validate your selection against the code and generate a Mermaid flowchart.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              background: 'rgba(0, 122, 204, 0.2)',
              border: '1px solid rgba(0, 122, 204, 0.3)',
              width: 'min(5vh, 40px)',
              height: 'min(5vh, 40px)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 'bold', color: '#007acc', fontSize: 'clamp(0.8rem, 2vh, 1rem)' }}>3</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(1.1rem, 3vh, 1.5rem)' }}>
                <FiZap />
                Render & Export
              </h3>
              <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5, fontSize: 'clamp(0.85rem, 2vh, 1rem)' }}>
                Click "Render Diagram" to visualize your flowchart.
                You can then copy the Mermaid code or export as SVG, PNG, JPG, or PDF.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'min(6vh, 48px)' }}>
          <button onClick={handleContinue} className={styles.button} style={{ fontSize: 'clamp(0.9rem, 2.5vh, 1rem)', padding: 'min(1.5vh, 0.75rem) min(3vh, 1.5rem)' }}>
            Continue to Code Editor
            <FiArrowRight style={{ marginLeft: 8 }} />
          </button>
        </div>
      </section>


    </div>
  );
};

export default Instructions;