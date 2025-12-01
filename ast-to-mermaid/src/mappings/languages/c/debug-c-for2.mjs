#!/usr/bin/env node

import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// For loop test code from test-flowchart.c
const testCode = `
int main() {
    int i, sum = 0;
    for (i = 0; i < 5; i++) {
        sum += i;
    }
    return 0;
}
`;

console.log("=== C For Loop Debug (test-flowchart.c style) ===\n");

// Extract AST
const ast = extractC(testCode);
console.log("AST extracted successfully");

// Normalize AST
const normalized = normalizeC(ast);
console.log("Full normalization completed");

// Find for statement in normalized AST
function findForStatement(node) {
    if (!node) return null;
    
    if (node.type === 'For') {
        return node;
    }
    
    if (Array.isArray(node.body)) {
        for (const child of node.body) {
            const result = findForStatement(child);
            if (result) return result;
        }
    } else if (typeof node === 'object') {
        for (const key in node) {
            if (typeof node[key] === 'object' && node[key] !== null) {
                const result = findForStatement(node[key]);
                if (result) return result;
            }
        }
    }
    
    return null;
}

const forStatement = findForStatement(normalized);
console.log("\nFor statement in normalized AST:", forStatement);
if (forStatement) {
    console.log("\nFor statement details:");
    console.log("  Type:", forStatement.type);
    console.log("  Init:", forStatement.init);
    console.log("  Cond:", forStatement.cond);
    console.log("  Update:", forStatement.update);
    console.log("  Body:", forStatement.body);
}