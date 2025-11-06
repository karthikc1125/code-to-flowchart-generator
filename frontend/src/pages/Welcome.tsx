import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCode, FiGitBranch, FiDownload, FiPlay } from 'react-icons/fi';
import styles from '../styles/Welcome.module.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/instructions');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Code → Mermaid Flowcharts</h1>
        <p className={styles.subtitle}>
          This tool converts valid source code into flowcharts. Please ensure your code is correct and complete for best results.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleGetStarted} className={styles.button}>
            <FiPlay style={{ marginRight: 8 }} />
            Get Started
          </button>
        </div>
      </header>

      <section style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16
          }}
        >
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCode />
              Multi-language detection
            </h3>
            <p style={{ margin: 0, opacity: 0.8 }}>JavaScript, TypeScript, Python, C/C++, Java, Pascal, Fortran.</p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiGitBranch />
              Accurate parsing
            </h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Tree‑sitter backed parsing for precise flow extraction.</p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiZap />
              One‑click render
            </h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Preview only when you choose—no auto rerenders.</p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiDownload />
              Easy export
            </h3>
            <p style={{ margin: 0, opacity: 0.8 }}>Export as SVG, PNG, JPG, or PDF directly from preview.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;