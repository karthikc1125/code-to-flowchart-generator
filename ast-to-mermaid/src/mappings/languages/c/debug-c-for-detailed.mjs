#!/usr/bin/env node

import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Simple for loop test code
const testCode = `
int main() {
    for (int i = 0; i < 5; i++) {
        printf("Hello World");
    }
    return 0;
}
`;

console.log("=== C For Loop Detailed Debug ===\n");

// Extract AST
const ast = extractC(testCode);

// Function to print node structure
function printNode(node, depth = 0) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type}: "${node.text}"`);
    
    if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            console.log(`${indent}  Child ${i}:`);
            printNode(node.children[i], depth + 2);
        }
    }
}

// Find and print for statement structure
function findForStatement(node) {
    if (node.type === 'for_statement') {
        console.log("\nFor Statement Structure:");
        printNode(node);
        return;
    }
    
    if (node.children) {
        for (const child of node.children) {
            findForStatement(child);
        }
    }
}

findForStatement(ast);