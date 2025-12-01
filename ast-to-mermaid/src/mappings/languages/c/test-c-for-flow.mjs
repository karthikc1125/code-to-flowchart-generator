#!/usr/bin/env node

// Test C for loop handling
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/c/pipeline/flow.mjs';

console.log("=== Testing C For Loop Handling ===\n");

try {
    // Read the C file
    const cCode = readFileSync('./test-flowchart.c', 'utf8');
    console.log("C code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(cCode);
    console.log("Flowchart generated:");
    console.log("===================");
    console.log(flowchart);
    
    // Save to file
    writeFileSync('./test-c-for-output.mmd', flowchart);
    console.log("\nFlowchart saved to test-c-for-output.mmd");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}