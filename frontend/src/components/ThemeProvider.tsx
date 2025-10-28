import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider, DefaultTheme } from 'styled-components';

const lightTheme: DefaultTheme = {
  mode: 'light',
  background: '#f5f7fa',
  card: '#fff',
  text: '#222',
  accent: '#3498db',
  border: '#e1e4e8',
};

const darkTheme: DefaultTheme = {
  mode: 'dark',
  background: '#1a1a1a',
  card: '#23272f',
  text: '#f5f7fa',
  accent: '#8ec6ff',
  border: '#404040',
};

const ThemeToggleContext = createContext({ toggle: () => {}, mode: 'light' });

export const useThemeToggle = () => useContext(ThemeToggleContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeToggleContext.Provider value={{ toggle, mode }}>
      <StyledThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeToggleContext.Provider>
  );
}; 