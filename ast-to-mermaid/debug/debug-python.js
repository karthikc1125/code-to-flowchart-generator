import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');

// Let's manually parse and inspect the AST nodes
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const parser = new Parser();
parser.setLanguage(PythonGrammar);

console.log('=== PYTHON CODE ===');
console.log(pyCode);
console.log('\n=== AST NODES ===');

const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

function traverse(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}Node type: ${node.type}`);
  console.log(`${indent}  Text: ${JSON.stringify(node.text)}`);
  
  // Check if this node is detected as an input call
  // We'll simulate the pythonConfig.isInputCall function
  function isInputCall(node) {
    if (node.type === 'call') {
      const callee = node.child(0)?.text || '';
      return /\binput\b|\bread\b|\braw_input\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c.type === 'call');
      if (callExpr) {
        const callee = callExpr.child(0)?.text || '';
        return /\binput\b|\bread\b|\braw_input\b/i.test(callee);
      }
    }
    // Also check for assignments that contain input calls
    if (node.type === 'assignment') {
      const callExpr = node.children.find(c => c.type === 'call');
      if (callExpr) {
        const callee = callExpr.child(0)?.text || '';
        return /\binput\b|\bread\b|\braw_input\b/i.test(callee);
      }
    }
    return false;
  }
  
  if (isInputCall(node)) {
    console.log(`${indent}  *** DETECTED AS INPUT CALL ***`);
  }
  
  // Recursively traverse children
  for (let i = 0; i < node.childCount; i++) {
    traverse(node.child(i), depth + 1);
  }
}

traverse(rootNode);

console.log('\n=== GENERATING MERMAID ===');
generateMermaid({ code: pyCode, language: 'py' }).then(result => {
  console.log(result);
}).catch(err => {
  console.error('Error:', err);
});