import React from 'react';
import styled from 'styled-components';
import { useThemeToggle } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitchButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const GlowingSun = styled(Sun)`
  color: #fcd34d; /* light orange/yellow */
  filter: drop-shadow(0 0 4px #fcd34d) drop-shadow(0 0 8px #fcd34d);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      filter: drop-shadow(0 0 4px #fcd34d) drop-shadow(0 0 8px #fcd34d);
    }
    50% {
      filter: drop-shadow(0 0 6px #fcd34d) drop-shadow(0 0 12px #fcd34d);
    }
    100% {
      filter: drop-shadow(0 0 4px #fcd34d) drop-shadow(0 0 8px #fcd34d);
    }
  }
`;

const ThemeSwitch: React.FC = () => {
  const { toggle, mode } = useThemeToggle();
  
  return (
    <ThemeSwitchButton onClick={toggle} aria-label="Toggle theme">
      {mode === 'dark' ? <GlowingSun size={20} /> : <Moon size={20} />}
    </ThemeSwitchButton>
  );
};

export default ThemeSwitch;