import React from 'react';
import styled from 'styled-components';
import { useThemeToggle } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Bar = styled.header`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.card};
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const AppName = styled(motion.h1)`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, ${({ theme }) => theme.accent}, #7f53ac 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const ThemeButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
  transition: color 0.2s;
`;

const Topbar: React.FC = () => {
  const { toggle, mode } = useThemeToggle();
  return (
    <Bar>
      <AppName
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Flowchart App
      </AppName>
      <ThemeButton onClick={toggle} aria-label="Toggle theme">
        {mode === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </ThemeButton>
    </Bar>
  );
};

export default Topbar; 