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

  // Set initial theme class on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const initialMode = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
      if (initialMode === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', mode);
    
    // Add/remove CSS classes for theme-specific styling
    if (mode === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    
    // Log for debugging
    console.log('Theme switched to:', mode);
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