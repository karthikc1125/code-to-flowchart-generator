# Adding New Language Support

This guide explains how to add support for a new programming language to the AST-to-Mermaid converter.

## Prerequisites

1. The language must be supported by [tree-sitter](https://tree-sitter.github.io/tree-sitter/)
2. You should have a good understanding of the language's syntax and AST structure

## Steps to Add a New Language

### 1. Install Tree-sitter Grammar

First, you need to install the tree-sitter grammar for your language:

```bash
npm install tree-sitter-[language-name]
```

### 2. Create Language Mapping Files

Create two files in the [src/mappings](../../src/mappings/) directory:

1. `[language].mjs` - Main mapping function
2. `[language]-config.mjs` - Configuration object

#### Main Mapping Function ([language].mjs)

```javascript
import { buildFlowchart } from './common-flowchart.mjs';
import { [language]Config } from './[language]-config.mjs';

export function map[Language]ToFlowchart(code) {
  return buildFlowchart(code, [language]Config);
}
```

#### Configuration File ([language]-config.mjs)

```javascript
export const [language]Config = {
  rootNodeTypes: ['[root-node-type]'],
  findStatementNodes(root) {
    // Implementation to find statement nodes
  },
  isFunctionDefinition(node) {
    // Detect user-defined functions
  },
  extractFunctionName(node) {
    // Extract function names
  },
  isAssignment(node) {
    // Detect assignments
  },
  isInputCall(node) {
    // Detect input calls
  },
  isOutputCall(node) {
    // Detect output calls
  },
  isConditional(node) {
    // Detect if/switch statements
  },
  extractConditionInfo(node) {
    // Extract condition information
  },
  isLoop(node) {
    // Detect for/while loops
  },
  isReturnStatement(node) {
    // Detect return statements
  },
  isBreakStatement(node) {
    // Detect break statements
  },
  isContinueStatement(node) {
    // Detect continue statements
  }
};
```

### 3. Update Language Detection

Add the new language to the language detection module in [src/language-detect.mjs](../../src/language-detect.mjs):

```javascript
const languageMap = {
  // ... existing mappings
  '.[extension]': '[language]'
};
```

### 4. Update Index File

Add exports for the new language in [src/mappings/index.mjs](../../src/mappings/index.mjs):

```javascript
export { map[Language]ToFlowchart } from './[language].mjs';
```

### 5. Create Test Files

Create test files in the [tests/[language]](../../tests/[language]/) directory:

1. A simple test file with basic syntax
2. A complex test file with all supported constructs
3. Unit tests for the mapping function

### 6. Update Documentation

Add the new language to this documentation and the API reference.

## Node Detection Functions

Each configuration must implement the following functions:

### Core Functions
- `rootNodeTypes` - Array of root node types for the language
- `findStatementNodes(root)` - Function to find statement nodes in the AST

### Function Detection
- `isFunctionDefinition(node)` - Detects function definitions
- `extractFunctionName(node)` - Extracts function names

### Statement Detection
- `isAssignment(node)` - Detects assignment statements
- `isInputCall(node)` - Detects input/output calls
- `isOutputCall(node)` - Detects output calls
- `isConditional(node)` - Detects conditional statements (if, switch)
- `extractConditionInfo(node)` - Extracts condition information
- `isLoop(node)` - Detects loop statements (for, while)
- `isReturnStatement(node)` - Detects return statements
- `isBreakStatement(node)` - Detects break statements
- `isContinueStatement(node)` - Detects continue statements

## Example Implementation

See the [C language implementation](../../src/mappings/c-config.mjs) for a complete example.