import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { FiCode } from 'react-icons/fi';
import styles from '../styles/MermaidEditor.module.css';

interface DiagramEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRender: () => void;
  isLoading?: boolean;
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({
  code,
  onChange,
  onRender,
  isLoading = false
}) => {
  const [editorValue, setEditorValue] = useState(code);

  // Update editorValue when code prop changes
  useEffect(() => {
    setEditorValue(code);
  }, [code]);

  return (
    <div className={styles.editorSection}>
      <h2 className={styles.sectionTitle}>
        <FiCode size={24} />
        Diagram Code
      </h2>
      <div className={styles.editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="mermaid"
          value={editorValue}
          onChange={(value) => {
            setEditorValue(value || '');
            onChange(value);
          }}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            renderWhitespace: 'selection',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            snippetSuggestions: 'inline',
            wordBasedSuggestions: 'currentDocument',
            suggest: {
              preview: true,
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
            }
          }}
        />
      </div>
      <button
        className={styles.renderButton}
        onClick={onRender}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className={styles.loadingSpinner} />
            Rendering...
          </>
        ) : (
          'Render Diagram'
        )}
      </button>
    </div>
  );
};

export default DiagramEditor; 