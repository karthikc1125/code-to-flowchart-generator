#!/usr/bin/env node

import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';
import { readFileSync } from 'fs';

// Read the actual test-flowchart.c file
const testCode = readFileSync('./test-flowchart.c', 'utf8');

console.log("=== Debug test-flowchart.c ===\n");

// Extract AST
const ast = extractC(testCode);
console.log("AST extracted successfully");

// Normalize AST
const normalized = normalizeC(ast);
console.log("Full normalization completed");

// Find all for statements in normalized AST
function findAllForStatements(node, results = []) {
    if (!node) return results;
    
    if (node.type === 'For') {
        results.push(node);
    }
    
    if (Array.isArray(node.body)) {
        for (const child of node.body) {
            findAllForStatements(child, results);
        }
    } else if (typeof node === 'object') {
        for (const key in node) {
            if (typeof node[key] === 'object' && node[key] !== null) {
                findAllForStatements(node[key], results);
            }
        }
    }
    
    return results;
}

const forStatements = findAllForStatements(normalized);
console.log("\nFound", forStatements.length, "for statements:");

forStatements.forEach((forStatement, index) => {
    console.log(`\nFor statement ${index + 1}:`);
    console.log("  Type:", forStatement.type);
    console.log("  Init:", forStatement.init);
    console.log("  Cond:", forStatement.cond);
    console.log("  Update:", forStatement.update);
    console.log("  Body:", forStatement.body);
});