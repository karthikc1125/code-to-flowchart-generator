#!/usr/bin/env node

import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { readFileSync } from 'fs';

// Read the actual test-for-loop.c file
const testCode = readFileSync('./test-for-loop.c', 'utf8');

console.log("=== Debug test-for-loop.c AST ===\n");

// Extract AST
const ast = extractC(testCode);
console.log("AST extracted successfully");

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