/**
 * Test file for C function mappings
 * Demonstrates how function definitions and calls are mapped
 */

import { mapFunction } from '../functions/function-definition.mjs';
import { mapFunctionCall } from '../functions/function-call.mjs';

// Mock context for testing
const mockContext = {
  counter: 0,
  nodes: [],
  edges: [],
  last: null,
  
  next() {
    return `node_${++this.counter}`;
  },
  
  add(id, content) {
    this.nodes.push({ id, content });
  },
  
  addEdge(from, to) {
    this.edges.push({ from, to });
  }
};

// Example normalized function definition node
const functionDefinitionNode = {
  type: 'Function',
  name: 'calculateSum',
  parameters: ['a', 'b'],
  body: [
    // Body statements would be processed separately
  ]
};

// Example normalized function call node
const functionCallNode = {
  type: 'FunctionCall',
  name: 'calculateSum',
  arguments: ['x', 'y']
};

// Test function mapping
console.log('Testing function definition mapping:');
mapFunction(functionDefinitionNode, mockContext);
console.log('Nodes:', mockContext.nodes);
console.log('Edges:', mockContext.edges);

// Reset context for next test
mockContext.counter = 0;
mockContext.nodes = [];
mockContext.edges = [];

console.log('\nTesting function call mapping:');
mapFunctionCall(functionCallNode, mockContext);
console.log('Nodes:', mockContext.nodes);
console.log('Edges:', mockContext.edges);