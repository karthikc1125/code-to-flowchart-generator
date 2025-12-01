#!/usr/bin/env node

import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// Simple for loop test code
const testCode = `
int main() {
    for (int i = 0; i < 5; i++) {
        printf("Hello World");
    }
    return 0;
}
`;

console.log("=== C For Loop Debug ===\n");

// Extract AST
const ast = extractC(testCode);
console.log("Raw AST:");
console.log(JSON.stringify(ast, null, 2));

// Normalize AST
const normalized = normalizeC(ast);
console.log("\nNormalized AST:");
console.log(JSON.stringify(normalized, null, 2));