// Test the extractInputInfo function with full debugging
import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

function textOf(node) { 
  return node?.text || ''; 
}

function getVariableName(node) {
  if (!node) return '';
  if (node.type === 'identifier') return node.text;
  return node.text || '';
}

function extractCallLabel(callNode) {
  // Get all children except the first one (function name)
  const args = (callNode.children || []).slice(1);
  let argText = args[0]?.text || '';
  argText = argText.trim();
  if (argText.startsWith('(') && argText.endsWith(')')) {
    argText = argText.slice(1, -1).trim();
  }
  if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith("'") && argText.endsWith("'"))) {
    argText = argText.slice(1, -1);
  }
  return argText;
}

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const pyCode = `name = input("What is your name? ")`;
const tree = parser.parse(pyCode);
const assignment = tree.rootNode.child(0).child(0); // Get the assignment node

console.log('Assignment node:');
console.log('  Type:', assignment.type);
console.log('  Text:', JSON.stringify(assignment.text));

// Debug the extractInputInfo function step by step
function findInputCall(n) {
  if (!n) return null;
  if (n.type === 'call') {
    // Get the first child which should be the function name
    const calleeNode = n.children && n.children.length > 0 ? n.children[0] : null;
    const callee = textOf(calleeNode);
    if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
      return n;
    }
    // Check arguments for nested input calls
    if (n.children) {
      for (const child of n.children) {
        const found = findInputCall(child);
        if (found) return found;
      }
    }
  }
  return null;
};

console.log('\n=== Calling extractInputInfo ===');

// Simulate the extractInputInfo function
let callExpr = null;

// Find the call node within the assignment
function findCallNode(node) {
  if (node.type === 'call') {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const result = findCallNode(child);
      if (result) return result;
    }
  }
  return null;
}

if (assignment.type === 'assignment') {
  callExpr = findCallNode(assignment);
  console.log('Found callExpr:', callExpr ? `${callExpr.type}: ${JSON.stringify(callExpr.text)}` : 'null');
  
  if (!callExpr) {
    callExpr = findInputCall(assignment);
    console.log('findInputCall result:', callExpr ? `${callExpr.type}: ${JSON.stringify(callExpr.text)}` : 'null');
  }
  
  // For assignments with input calls, we want to show the variable name
  if (callExpr) {
    const varName = getVariableName(assignment.children.find(c => c.type === 'identifier'));
    console.log('Variable name:', varName);
    
    if (varName) {
      // Check if the input call has a prompt argument
      const prompt = extractCallLabel(callExpr);
      console.log('Prompt from extractCallLabel:', JSON.stringify(prompt));
      
      if (prompt) {
        console.log('Returning:', { prompt: prompt });
      } else {
        // If no prompt, use the variable name
        console.log('Returning:', { prompt: varName });
      }
    }
  }
}

const prompt = callExpr ? extractCallLabel(callExpr) : '';
console.log('Final result:', { prompt });