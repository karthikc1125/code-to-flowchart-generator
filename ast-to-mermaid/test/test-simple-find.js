// Simple test to find the input call
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

function textOf(node) { 
  return node?.text || ''; 
}

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const pyCode = `name = input("What is your name? ")`;
const tree = parser.parse(pyCode);
const assignment = tree.rootNode.child(0).child(0); // Get the assignment node

console.log('Assignment node:');
console.log('  Type:', assignment.type);
console.log('  Text:', JSON.stringify(assignment.text));

// Simple approach to find the call node
function findCallNode(node) {
  if (node.type === 'call') {
    // Get the first child which should be the function name
    const calleeNode = node.children && node.children.length > 0 ? node.children[0] : null;
    const callee = textOf(calleeNode);
    console.log('  Call node, callee:', callee);
    if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
      console.log('  Found input call');
      return node;
    }
  }
  if (node.children) {
    for (const child of node.children) {
      const result = findCallNode(child);
      if (result) return result;
    }
  }
  return null;
}

console.log('\n=== Testing simple findCallNode ===');
const callNode = findCallNode(assignment);
console.log('Call node found:', callNode ? 'yes' : 'no');

if (callNode) {
  // Extract the prompt
  const args = (callNode.children || []).slice(1);
  let argText = args[0]?.text || '';
  argText = argText.trim();
  if (argText.startsWith('(') && argText.endsWith(')')) {
    argText = argText.slice(1, -1).trim();
  }
  if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith("'") && argText.endsWith("'"))) {
    argText = argText.slice(1, -1);
  }
  console.log('Prompt:', JSON.stringify(argText));
}