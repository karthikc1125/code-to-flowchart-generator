This directory contains a single comprehensive JSON instruction file for RAG-powered Mermaid diagram generation.

## File: `rag_instructions.json`

This single file contains all the necessary information:
- **Mermaid syntax**: Node shapes, edge styles, flowchart direction
- **Styling**: Color palette, theme settings, CSS classes
- **Conversion rules**: Step-by-step instructions for the LLM
- **Examples**: Concrete input/output pairs for common patterns
- **Validation**: Rules to ensure proper Mermaid syntax

## Benefits of Single File Approach

1. **Easier maintenance** - One file to update instead of multiple
2. **Better consistency** - All rules in one place
3. **Faster loading** - Single file read operation
4. **Clearer structure** - Logical grouping of related concepts
5. **Version control** - Single file to track changes

## Usage

The backend RAG route loads this file and uses it to:
- Build structured prompts for the LLM
- Validate generated output
- Provide fallback corrections if needed
- Ensure consistent Mermaid syntax across all generations


