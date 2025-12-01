#!/usr/bin/env node

import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// For loop test code with declaration
const testCode = `
int main() {
    for (int i = 0; i < 5; i++) {
        printf("Hello World");
    }
    return 0;
}
`;

console.log("=== C For Loop Parts Debug (declaration style) ===\n");

// Extract AST
const ast = extractC(testCode);

// Find for statement
function findForStatement(node) {
    if (node.type === 'for_statement') {
        return node;
    }
    
    if (node.children) {
        for (const child of node.children) {
            const result = findForStatement(child);
            if (result) return result;
        }
    }
    
    return null;
}

const forStatement = findForStatement(ast);
if (forStatement) {
    console.log("For statement found");
    console.log("Children count:", forStatement.children.length);
    
    for (let i = 0; i < forStatement.children.length; i++) {
        console.log(`  Child ${i}: ${forStatement.children[i].type} = "${forStatement.children[i].text}"`);
    }
    
    // Test normalization of individual parts
    console.log("\n=== Testing Normalization of For Parts ===");
    
    const initNode = forStatement.child(2);
    const condNode = forStatement.child(3);
    const updateNode = forStatement.child(5);
    const bodyNode = forStatement.child(7);
    
    console.log("\nInit node:", initNode.type, "=", initNode.text);
    const normalizedInit = normalizeC(initNode);
    console.log("Normalized init:", JSON.stringify(normalizedInit, null, 2));
    
    console.log("\nCondition node:", condNode.type, "=", condNode.text);
    const normalizedCond = normalizeC(condNode);
    console.log("Normalized condition:", JSON.stringify(normalizedCond, null, 2));
    
    console.log("\nUpdate node:", updateNode.type, "=", updateNode.text);
    const normalizedUpdate = normalizeC(updateNode);
    console.log("Normalized update:", JSON.stringify(normalizedUpdate, null, 2));
    
    console.log("\nBody node:", bodyNode.type, "=", bodyNode.text);
    const normalizedBody = normalizeC(bodyNode);
    console.log("Normalized body:", JSON.stringify(normalizedBody, null, 2));
}