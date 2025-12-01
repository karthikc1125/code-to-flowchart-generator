import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft, FiCode, FiFileText, FiZap } from 'react-icons/fi';
import ThemeSwitch from '../components/ThemeSwitchButton';

import styledComp from 'styled-components';

const Container = styledComp.div<{ theme?: { background: string, text: string } }> `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => props.theme?.background || '#f5f7fa'};
  padding: 1rem;
  color: ${props => props.theme?.text || '#222'};
`;

const Title = styledComp.h1<{ theme?: { text: string } }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme?.text || '#1f2937'};
  margin-bottom: 1rem;
`;

const Subtitle = styledComp.p<{ theme?: { text: string } }>`
  font-size: 1.5rem;
  color: ${props => props.theme?.text || '#4b5563'};
  margin-bottom: 2rem;
  text-align: center;
`;

const Header = styledComp.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const ContinueButton = styledComp.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

const Instructions: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/code-entry');
  };

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+C to continue to code editor
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        navigate('/code-entry');
      }
      // Ctrl+Shift+B to go back
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        navigate(-1);
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
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.3)';
          }}
        >
          <FiArrowLeft size={14} />
          Back
        </button>
      </div>
      <Header>
        <Title>How to Use This Tool</Title>
        <Subtitle>
          Follow these simple steps to convert your code into beautiful flowcharts
        </Subtitle>
      </Header>

      <section style={{ maxWidth: 800, margin: '32px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ 
              background: 'rgba(0, 122, 204, 0.2)', 
              border: '1px solid rgba(0, 122, 204, 0.3)',
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 'bold', color: '#007acc' }}>1</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCode />
                Enter Your Code
              </h3>
              <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5 }}>
                Paste your source code into the editor or import a file. 
                Supported languages include JavaScript, TypeScript, Python, Java, C/C++, Pascal, and Fortran.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ 
              background: 'rgba(0, 122, 204, 0.2)', 
              border: '1px solid rgba(0, 122, 204, 0.3)',
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 'bold', color: '#007acc' }}>2</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiFileText />
                Select Language & Convert
              </h3>
              <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5 }}>
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
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 'bold', color: '#007acc' }}>3</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiZap />
                Render & Export
              </h3>
              <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5 }}>
                Click "Render Diagram" to visualize your flowchart. 
                You can then copy the Mermaid code or export as SVG, PNG, JPG, or PDF.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <ContinueButton onClick={handleContinue}>
            Continue to Code Editor
            <FiArrowRight style={{ marginLeft: 8 }} />
          </ContinueButton>
        </div>
      </section>

      <section style={{ 
        maxWidth: 800, 
        margin: '48px auto 0', 
        padding: '24px 16px', 
        background: 'rgba(255,255,255,0.06)', 
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12
      }}>
        <h3 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Tips for Best Results</h3>
        <ul style={{ 
          textAlign: 'left', 
          maxWidth: 600, 
          margin: '0 auto',
          padding: '0 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16
        }}>
          <li style={{ lineHeight: 1.5 }}>Ensure your code is syntactically correct</li>
          <li style={{ lineHeight: 1.5 }}>Use clear, descriptive function and variable names</li>
          <li style={{ lineHeight: 1.5 }}>Break complex logic into smaller functions</li>
          <li style={{ lineHeight: 1.5 }}>Comment your code for better understanding</li>
        </ul>
      </section>
    </Container>
  );
};

export default Instructions;