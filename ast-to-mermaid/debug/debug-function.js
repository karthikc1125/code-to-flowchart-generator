import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';
import fs from 'fs';

function textOf(node) { 
  return node?.text || ''; 
}

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);

// Find the second assignment node
function findSecondAssignment(node) {
  if (node.type === 'assignment') {
    const text = node.text;
    if (text.includes('int(input')) {
      return node;
    }
  }
  for (let i = 0; i < node.childCount; i++) {
    const result = findSecondAssignment(node.child(i));
    if (result) return result;
  }
  return null;
}

const assignment = findSecondAssignment(tree.rootNode);
console.log('Assignment node:', assignment.type);
console.log('Assignment text:', JSON.stringify(assignment.text));

// Debug the isInputCall function step by step
function debugIsInputCall(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}Checking node type: ${node.type}`);
  console.log(`${indent}  Text: ${JSON.stringify(node.text)}`);
  
  if (!node) {
    console.log(`${indent}  Node is null, returning false`);
    return false;
  }
  
  if (node.type === 'call') {
    const callee = textOf((node.children || []).find(c => c.named));
    console.log(`${indent}  Call to: ${callee}`);
    if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
      console.log(`${indent}  Found input call, returning true`);
      return true;
    }
    console.log(`${indent}  Not an input call, checking children...`);
    // Check for nested input calls like int(input(...))
    // Recursively check all children
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        console.log(`${indent}  Checking child ${i}: ${child.type}`);
        if (debugIsInputCall(child, depth + 1)) {
          console.log(`${indent}  Found input call in child, returning true`);
          return true;
        }
      }
    }
    console.log(`${indent}  No input call found in children, returning false`);
    return false;
  }
  
  if (node.type === 'assignment') {
    console.log(`${indent}  Assignment node, checking children...`);
    // Check all children of the assignment
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        console.log(`${indent}  Checking child ${i}: ${child.type}`);
        if (debugIsInputCall(child, depth + 1)) {
          console.log(`${indent}  Found input call in child, returning true`);
          return true;
        }
      }
    }
    console.log(`${indent}  No input call found in assignment children, returning false`);
    return false;
  }
  
  console.log(`${indent}  Not a call or assignment, returning false`);
  return false;
}

console.log('\n=== DEBUGGING isInputCall ===');
const result = debugIsInputCall(assignment);
console.log('\nFinal result:', result);