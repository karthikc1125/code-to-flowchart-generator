# API Reference

## Table of Contents
- [Parser](#parser)
- [Language Detection](#language-detection)
- [Mappings](#mappings)
- [Flowchart Generation](#flowchart-generation)

## Parser

The parser module is responsible for parsing source code into Abstract Syntax Trees (ASTs).

### Functions

#### `parseCode(code, language)`
Parses the given source code into an AST using tree-sitter.

**Parameters:**
- `code` (string): The source code to parse
- `language` (string): The programming language of the source code

**Returns:**
- Object: The parsed AST

## Language Detection

The language detection module identifies the programming language of a given source code file.

### Functions

#### `detectLanguage(filename)`
Detects the programming language based on the file extension.

**Parameters:**
- `filename` (string): The name of the file including extension

**Returns:**
- string: The detected programming language

## Mappings

The mappings module contains language-specific configurations for converting AST nodes to flowchart elements.

### Structure

Each language has two mapping files:
1. `[language].mjs` - Main mapping function
2. `[language]-config.mjs` - Configuration object with node detection functions

### Available Languages
- C ([c.mjs](../../src/mappings/c.mjs), [c-config.mjs](../../src/mappings/c-config.mjs))
- C++ ([cpp.mjs](../../src/mappings/cpp.mjs), [cpp-config.mjs](../../src/mappings/cpp-config.mjs))
- Java ([java.mjs](../../src/mappings/java.mjs), [java-config.mjs](../../src/mappings/java-config.mjs))
- JavaScript ([javascript.mjs](../../src/mappings/javascript.mjs), [javascript-config.mjs](../../src/mappings/javascript-config.mjs))
- Python ([python.mjs](../../src/mappings/python.mjs), [python-config.mjs](../../src/mappings/python-config.mjs))

## Flowchart Generation

The flowchart generation module converts ASTs into Mermaid flowchart syntax.

### Functions

#### `generateFlowchart(ast, config)`
Generates a Mermaid flowchart from an AST using the provided configuration.

**Parameters:**
- `ast` (Object): The parsed AST
- `config` (Object): Language-specific configuration

**Returns:**
- string: Mermaid flowchart syntax