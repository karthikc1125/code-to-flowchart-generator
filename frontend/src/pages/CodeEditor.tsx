import React, { useRef } from 'react';
import Editor, { Monaco, OnChange } from '@monaco-editor/react';

interface CodeEditorProps {
  code?: string;
  language?: string;
  onChange?: (value: string) => void;
  height?: string;
  width?: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code = '',
  language = 'javascript',
  onChange,
  height = '100%',
  width = '100%',
  readOnly = false
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Configure Monaco Editor theme
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2A2D2E',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#FFFFFF',
        'editorWhitespace.foreground': '#404040',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editor.selectionHighlightBackground': '#264F78',
        'editor.wordHighlightBackground': '#575757',
        'editor.wordHighlightStrongBackground': '#004972',
        'editor.findMatchBackground': '#515C6A',
        'editor.findMatchHighlightBackground': '#314365',
        'editor.hoverHighlightBackground': '#2A2D2E',
        'editor.lineHighlightBorder': '#2A2D2E',
        'editor.rangeHighlightBackground': '#2A2D2E',
        'editor.symbolHighlightBackground': '#2A2D2E',
        'editor.symbolHighlightBorder': '#2A2D2E',
        'editorOverviewRuler.border': '#2A2D2E',
        'editorOverviewRuler.findMatchForeground': '#515C6A',
        'editorOverviewRuler.rangeHighlightForeground': '#2A2D2E',
        'editorOverviewRuler.selectionHighlightForeground': '#2A2D2E',
        'editorOverviewRuler.wordHighlightForeground': '#2A2D2E',
        'editorOverviewRuler.wordHighlightStrongForeground': '#2A2D2E',
        'editorOverviewRuler.modifiedForeground': '#2A2D2E',
        'editorOverviewRuler.addedForeground': '#2A2D2E',
        'editorOverviewRuler.deletedForeground': '#2A2D2E',
        'editorOverviewRuler.errorForeground': '#2A2D2E',
        'editorOverviewRuler.warningForeground': '#2A2D2E',
        'editorOverviewRuler.infoForeground': '#2A2D2E',
        'editorOverviewRuler.bracketMatchForeground': '#2A2D2E'
      }
    });

    monaco.editor.setTheme('vs-dark-custom');
  };

  const handleChange: OnChange = (value) => {
    if (value !== undefined) {
      onChange?.(value);
    }
  };

  return (
    <div style={{
      width,
      height,
      border: '1px solid #3A3D41',
      borderRadius: '4px',
      overflow: 'hidden',
      backgroundColor: '#1E1E1E'
    }}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark-custom"
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
          fontLigatures: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          parameterHints: { enabled: true },
          snippetSuggestions: 'inline',
          wordBasedSuggestions: 'currentDocument',
          suggest: {
            showMethods: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showKeywords: true,
            showWords: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showSnippets: true
          },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          matchBrackets: 'always',
          renderWhitespace: 'selection',
          renderControlCharacters: true,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: true,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            arrowSize: 11,
            verticalSliderSize: 10,
            horizontalSliderSize: 10
          },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          multiCursorModifier: 'alt',
          bracketPairColorization: {
            enabled: true
          },
          guides: {
            bracketPairs: true,
            indentation: true,
            highlightActiveIndentation: true
          },
          accessibilitySupport: 'on',
          ariaLabel: 'Code Editor',
          contextmenu: true,
          copyWithSyntaxHighlighting: true,
          cursorStyle: 'line',
          disableLayerHinting: false,
          disableMonospaceOptimizations: false,
          dragAndDrop: true,
          emptySelectionClipboard: true,
          fixedOverflowWidgets: false,
          glyphMargin: true,
          hideCursorInOverviewRuler: false,
          hover: {
            enabled: true,
            delay: 300,
            sticky: true
          },
          links: true,
          multiCursorMergeOverlapping: true,
          multiCursorPaste: 'full',
          occurrencesHighlight: 'singleFile',
          overviewRulerBorder: true,
          overviewRulerLanes: 2,
          padding: {
            top: 0,
            bottom: 0
          },
          quickSuggestionsDelay: 10,
          renderFinalNewline: 'on',
          renderValidationDecorations: 'editable',
          revealHorizontalRightPadding: 30,
          roundedSelection: true,
          rulers: [],
          selectOnLineNumbers: true,
          selectionClipboard: true,
          selectionHighlight: true,
          showUnused: true,
          tabCompletion: 'on',
          useTabStops: true,
          wordSeparators: '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?',
          wordWrapBreakAfterCharacters: '\t})]?|&,;',
          wordWrapBreakBeforeCharacters: '{([+',
          wordWrapColumn: 80,
          wrappingIndent: 'none',
          wrappingStrategy: 'simple'
        }}
      />
    </div>
  );
};

export default CodeEditor; 