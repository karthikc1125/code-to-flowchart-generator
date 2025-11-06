import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodeEntry from './CodeEntry';
import { convertCodeToMermaid, detectLanguageLocal, detectLanguageAPI } from '../services/api';

// Mock the modules
jest.mock('../services/api');
jest.mock('@monaco-editor/react', () => {
  return {
    __esModule: true,
    default: (props: any) => <div data-testid="mock-editor" {...props} />,
  };
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null }),
}));
jest.mock('../components/BackButton', () => {
  return {
    __esModule: true,
    default: (props: any) => <button data-testid="back-button" {...props} />,
  };
});

describe('CodeEntry', () => {
  beforeEach(() => {
    (convertCodeToMermaid as jest.Mock).mockResolvedValue('mock mermaid code');
    (detectLanguageLocal as jest.Mock).mockReturnValue('javascript');
    (detectLanguageAPI as jest.Mock).mockResolvedValue('javascript');
  });

  test('should show error when converting without selecting a language', async () => {
    render(<CodeEntry />);
    
    // Enter some code
    const inputEditor = screen.getByTestId('mock-editor');
    // Simulate entering code (we can't directly change the editor value in this mock)
    
    // Click convert without selecting a language
    const convertButton = screen.getByText('Convert');
    fireEvent.click(convertButton);
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText('// Error: Please select a language before converting')).toBeInTheDocument();
    });
  });

  test('should show language mismatch error when selected language does not match detected language', async () => {
    render(<CodeEntry />);
    
    // Select Python language
    const languageSelect = screen.getByLabelText('Language');
    fireEvent.mouseDown(languageSelect);
    fireEvent.click(screen.getByText('Python'));
    
    // Mock language detection to return JavaScript
    (detectLanguageLocal as jest.Mock).mockReturnValue('javascript');
    
    // Click convert
    const convertButton = screen.getByText('Convert');
    fireEvent.click(convertButton);
    
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Error: The selected language \(python\) does not match the detected language \(js\)/)).toBeInTheDocument();
    });
  });
});