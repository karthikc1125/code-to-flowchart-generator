import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Paper, TextField, IconButton } from '@mui/material';
import Editor from '@monaco-editor/react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { convertCodeToMermaid, detectLanguageLocal, detectLanguageAPI } from '../services/api';
import { FaPaperPlane } from 'react-icons/fa'; // Using react-icons instead
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '400px',
  border: '1px solid #333',
  borderRadius: '8px',
  backgroundColor: '#1e1e1e',
  overflow: 'hidden'
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const ChatMessage = styled(Box)(({ theme }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  '&.user': {
    alignSelf: 'flex-end',
    backgroundColor: '#007acc',
    color: 'white'
  },
  '&.ai': {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    color: 'white'
  }
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
  borderTop: '1px solid #333',
  backgroundColor: '#2d2d30'
}));

const CodeEntry: React.FC = () => {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    // language selection removed; auto-detection is used
    const navigate = useNavigate();
    const location = useLocation();
    const inputEditorRef = useRef<any>(null);
    const outputEditorRef = useRef<any>(null);
    const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    const [detectedLanguage, setDetectedLanguage] = useState<null | 'js' | 'ts' | 'python' | 'java' | 'c' | 'cpp' | 'no language detected'>(null);
    // For API calls, we need a separate state with only valid language codes
    const [languageForConversion, setLanguageForConversion] = useState<null | 'js' | 'ts' | 'python' | 'java' | 'c' | 'cpp'>(null);
    const [isDetecting, setIsDetecting] = useState(false);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Handle incoming code from WriteWithAI page
    useEffect(() => {
        const state = location.state as { code?: string } | null;
        if (state?.code) {
            setInputCode(state.code);
        }
    }, [location.state]);

    useEffect(() => {
        const code = inputCode.trim();
        const timer = setTimeout(() => {
            if (!code) {
                setDetectedLanguage(null);
                setLanguageForConversion(null);
            } else {
                // First try fast local detection for immediate feedback
                const localDetected = detectLanguageLocal(code);
                setDetectedLanguage(localDetected);
                
                // Then use API detection for more accurate results
                const apiDetect = async () => {
                    setIsDetecting(true);
                    try {
                        const apiDetected = await detectLanguageAPI(code);
                        // Map API response to our expected types
                        const mappedLanguage = apiDetected === 'javascript' ? 'js' : 
                                             apiDetected === 'typescript' ? 'ts' : 
                                             apiDetected === 'python' ? 'python' : 
                                             apiDetected === 'java' ? 'java' : 
                                             apiDetected === 'c' ? 'c' : 
                                             apiDetected === 'cpp' ? 'cpp' : 
                                             'no language detected';
                        
                        setDetectedLanguage(mappedLanguage);
                        // Set language for conversion API calls (only valid language codes)
                        if (mappedLanguage === 'js' || mappedLanguage === 'ts' || mappedLanguage === 'python' || 
                            mappedLanguage === 'java' || mappedLanguage === 'c' || mappedLanguage === 'cpp') {
                            setLanguageForConversion(mappedLanguage);
                        } else {
                            setLanguageForConversion(null);
                        }
                    } catch (error) {
                        // If API detection fails, fall back to local detection
                        console.warn('API language detection failed, falling back to local detection:', error);
                        const localDetected = detectLanguageLocal(code);
                        setDetectedLanguage(localDetected);
                        // Set language for conversion API calls (only valid language codes)
                        if (localDetected === 'js' || localDetected === 'ts' || localDetected === 'python' || 
                            localDetected === 'java' || localDetected === 'c' || localDetected === 'cpp') {
                            setLanguageForConversion(localDetected);
                        } else {
                            setLanguageForConversion(null);
                        }
                    } finally {
                        setIsDetecting(false);
                    }
                };
                
                apiDetect();
            }
        }, 300); // Reduced delay for better responsiveness
        return () => clearTimeout(timer);
    }, [inputCode]);

    const getEditorLanguage = (): string => {
        const map: Record<string, string> = {
            js: 'javascript',
            ts: 'typescript',
            python: 'python',
            java: 'java',
            c: 'c',
            cpp: 'cpp',
        };
        if (!detectedLanguage) return 'plaintext';
        return map[detectedLanguage] || 'plaintext';
    };

    const addColorsToMermaid = (mermaidCode: string): string => {
        if (!mermaidCode || mermaidCode.startsWith('//')) return mermaidCode;
        
        // Add style definitions and classDefs for different shapes
        const lines = mermaidCode.split('\n');
        const flowchartLine = lines.findIndex(line => line.trim().startsWith('flowchart') || line.trim().startsWith('graph'));
        
        if (flowchartLine === -1) return mermaidCode;
        
        // Define color styles for different node types
        const styleDefinitions = [
            '    %% Color definitions for different shapes',
            '    classDef startEndClass fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000',
            '    classDef processClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000',
            '    classDef decisionClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000',
            '    classDef inputOutputClass fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000',
            ''
        ];
        
        // Insert style definitions after the flowchart declaration
        lines.splice(flowchartLine + 1, 0, ...styleDefinitions);
        
        // Identify and classify nodes based on their shape
        const nodeClasses: { [key: string]: string } = {};
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            // Start/End nodes (stadium shape [( )])
            const stadiumMatch = trimmed.match(/([A-Z0-9_]+)\[\(([^\)]+)\)\]/);
            if (stadiumMatch) {
                nodeClasses[stadiumMatch[1]] = 'startEndClass';
            }
            
            // Decision nodes (diamond { })
            const diamondMatch = trimmed.match(/([A-Z0-9_]+)\{([^\}]+)\}/);
            if (diamondMatch) {
                nodeClasses[diamondMatch[1]] = 'decisionClass';
            }
            
            // Process nodes (rectangle [ ])
            const rectMatch = trimmed.match(/([A-Z0-9_]+)\[([^\]]+)\]/);
            if (rectMatch && !stadiumMatch) {
                nodeClasses[rectMatch[1]] = 'processClass';
            }
            
            // Input/Output nodes (parallelogram [/ /] or [\ \\])
            const parallelMatch = trimmed.match(/([A-Z0-9_]+)\[\/([^\/]+)\/\]|([A-Z0-9_]+)\[\\\\([^\\]+)\\\\\]/);
            if (parallelMatch) {
                nodeClasses[parallelMatch[1] || parallelMatch[3]] = 'inputOutputClass';
            }
        });
        
        // Add class assignments at the end
        const classAssignments: string[] = [];
        Object.entries(nodeClasses).forEach(([nodeId, className]) => {
            classAssignments.push(`    class ${nodeId} ${className}`);
        });
        
        if (classAssignments.length > 0) {
            lines.push('', '    %% Apply styles to nodes', ...classAssignments);
        }
        
        return lines.join('\n');
    };

    const handleConvert = async () => {
        const code = inputCode.trim();
        if (!code) return;
        try {
            setOutputCode('// Converting to Mermaid...');
            // send detected language to backend for consistent conversion
            const mermaid = await convertCodeToMermaid(code, languageForConversion || 'auto');
            // Don't add colors here - keep the code clean for editing
            setOutputCode(mermaid || '');
        } catch (e: any) {
            setOutputCode(`// Error: ${e?.message || String(e)}`);
        }
    };

    const handleExplainCode = () => {
        if (inputCode.trim()) {
            navigate('/analysis', { state: { code: inputCode } });
        }
    };

    const handleCopyAndOpenMermaid = () => {
        if (outputCode) {
            // Add colors only when rendering the diagram
            const coloredMermaid = addColorsToMermaid(outputCode);
            navigator.clipboard.writeText(outputCode);
            navigate('/mermaid-editor', { state: { mermaidCode: coloredMermaid } });
        }
    };

    return (
        <Box sx={{ maxWidth: 1300, mx: 'auto', p: 4 }}>
            <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 10 }}>
                <BackButton onClick={() => navigate(-1)} />
            </Box>
            <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
                Code to Mermaid Flow Code Converter
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Input Programming Code
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.kt,.swift';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    setInputCode(e.target?.result as string || '');
                                                };
                                                reader.readAsText(file);
                                            }
                                        };
                                        input.click();
                                    }}
                                >
                                    Import
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate('/write-with-ai')}
                                >
                                    AI
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    Detected: {isDetecting ? 'detecting...' : (detectedLanguage ? ({
                                        js: 'JavaScript',
                                        ts: 'TypeScript',
                                        python: 'Python',
                                        java: 'Java',
                                        c: 'C',
                                        cpp: 'C++',
                                        'no language detected': 'no language detected'
                                    } as any)[detectedLanguage] : 'no language detected')}
                                </Typography>
                            </Box>
                        </Box>
                        <Editor
                            height="400px"
                            language={getEditorLanguage()}
                            value={inputCode}
                            onChange={(value) => setInputCode(value || '')}
                            onMount={(editor) => { inputEditorRef.current = editor; editor.focus(); }}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 15,
                                lineNumbers: 'on',
                                readOnly: false,
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                cursorBlinking: 'smooth',
                                selectOnLineNumbers: true,
                                glyphMargin: true,
                                folding: true,
                                lineDecorationsWidth: 10,
                                lineNumbersMinChars: 3,
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleConvert}
                                disabled={!inputCode.trim()}
                                sx={{ minWidth: 200 }}
                            >
                                Convert
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleExplainCode}
                                disabled={!inputCode.trim()}
                                sx={{ minWidth: 200 }}
                            >
                                Explain Code
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                            Generated Mermaid Flow Code
                        </Typography>
                        <Editor
                            height="400px"
                            language="mermaid"
                            value={outputCode}
                            onChange={(value) => setOutputCode(value || '')}
                            onMount={(editor) => { outputEditorRef.current = editor; }}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 15,
                                lineNumbers: 'on',
                                readOnly: false,
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                cursorBlinking: 'smooth',
                                selectOnLineNumbers: true,
                                glyphMargin: true,
                                folding: true,
                                lineDecorationsWidth: 10,
                                lineNumbersMinChars: 3,
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleCopyAndOpenMermaid}
                                disabled={!outputCode.trim()}
                                sx={{ minWidth: 260 }}
                            >
                                Render Diagram
                            </Button>
                        </Box>
                    </Box>
                </Box>
            
            </Paper>
        </Box>
    );
};

export default CodeEntry;