import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiCode, FiGitBranch, FiDownload, FiPlay, FiArrowLeft } from 'react-icons/fi';
import ThemeSwitch from '../components/ThemeSwitchButton';

import styled from 'styled-components';

const Container = styled.div<{ theme?: { background: string, text: string } }> `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => props.theme?.background || '#f5f7fa'};
  padding: 1rem;
  color: ${props => props.theme?.text || '#222'};
`;

const Title = styled.h1<{ theme?: { text: string } }> `
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme?.text || '#1f2937'};
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p<{ theme?: { text: string } }> `
  font-size: 1.5rem;
  color: ${props => props.theme?.text || '#4b5563'};
  margin-bottom: 2rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #2563eb;
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #4b5563;
  }
`;

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/instructions');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+G to go back to college page
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        navigate('/');
      }
      // Ctrl+Shift+S to get started
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        navigate('/instructions');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <Container>
      <ThemeSwitch />
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title>Code → Mermaid Flowcharts</Title>
        <Subtitle>
          This tool converts valid source code into flowcharts. Please ensure your code is correct and complete for best results.
        </Subtitle>
        <ButtonContainer>
          <BackButton onClick={handleGoBack}>
            <FiArrowLeft style={{ marginRight: 8 }} />
            Back to College Page
          </BackButton>
          <StartButton onClick={handleGetStarted}>
            <FiPlay style={{ marginRight: 8 }} />
            Get Started
          </StartButton>
        </ButtonContainer>
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
    </Container>
  );
};

export default Welcome;