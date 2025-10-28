import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    background: string;
    card: string;
    text: string;
    accent: string;
    border: string;
  }
} 