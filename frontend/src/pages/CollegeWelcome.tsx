import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
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
  transition: background-color 0.3s, color 0.3s;
`;

const Title = styled.h1<{ theme?: { text: string } }> `
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme?.text || '#1f2937'};
  margin-bottom: 1rem;
  text-align: center;
`;

const CollegeName = styled.h2<{ theme?: { text: string } }> `
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.theme?.text || '#1f2937'};
  margin-bottom: 1.5rem;
  text-align: center;
  color: #3b82f6;
`;

const Subtitle = styled.p<{ theme?: { text: string } }> `
  font-size: 1.5rem;
  color: ${props => props.theme?.text || '#4b5563'};
  margin-bottom: 2rem;
  text-align: center;
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

const CollegeWelcome: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/welcome');
  };

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+W to go to main welcome page
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        navigate('/welcome');
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
        <Title>Code to Flowchart Converter</Title>
        <CollegeName>Government Engineering College, Mosalehosahalli</CollegeName>
        <Subtitle>
          Convert your programming logic into visual flowcharts instantly
        </Subtitle>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <StartButton onClick={handleGetStarted}>
            <FiPlay style={{ marginRight: 8 }} />
            Welcome
          </StartButton>
        </div>
      </header>
    </Container>
  );
};

export default CollegeWelcome;