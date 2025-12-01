# C Language Function Mappings

This directory contains the mapping functions for handling C language functions in the AST to Mermaid conversion process.

## Files

- [function.mjs](file:///c:/Users/Administrator/Videos/flow%20updates/ast-to-mermaid/src/mappings/languages/c/functions/function.mjs) - Maps raw AST function declarations to a standardized format
- [function-definition.mjs](file:///c:/Users/Administrator/Videos/flow%20updates/ast-to-mermaid/src/mappings/languages/c/functions/function-definition.mjs) - Maps function definitions to Mermaid flowchart nodes
- [function-call.mjs](file:///c:/Users/Administrator/Videos/flow%20updates/ast-to-mermaid/src/mappings/languages/c/functions/function-call.mjs) - Maps function calls to Mermaid flowchart nodes
- [index.mjs](file:///c:/Users/Administrator/Videos/flow%20updates/ast-to-mermaid/src/mappings/languages/c/functions/index.mjs) - Exports all function mapping functions

## Function Definitions

Function definitions are represented as double rectangles in the flowchart with the label "function functionName".

The main function is skipped to avoid cluttering the diagram.

## Function Calls

Function calls are represented as double rectangles in the flowchart with the label "functionName()".

## Integration

These mappings are integrated into the main C language mapping in [c.mjs](file:///c:/Users/Administrator/Videos/flow%20updates/ast-to-mermaid/src/mappings/languages/c/c.mjs) and [map-node-c.mjs](file:///c:/Users/Administrator/Videos/flow%20updates/ast-to-mermaid/src/mappings/languages/c/map-node-c.mjs).