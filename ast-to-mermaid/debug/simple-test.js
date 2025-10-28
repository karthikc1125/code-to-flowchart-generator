// Simple test to see if we can get the prompt
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const pyCode = `name = input("What is your name? ")`;
const tree = parser.parse(pyCode);
const assignment = tree.rootNode.child(0).child(0); // Get the assignment node

console.log('Assignment node:');
console.log('  Type:', assignment.type);
console.log('  Text:', JSON.stringify(assignment.text));

// Find the call node
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

const callNode = findCallNode(assignment);
console.log('Call node:', callNode ? callNode.type : 'null');
if (callNode) {
  console.log('Call text:', JSON.stringify(callNode.text));
  
  // Extract the prompt manually
  // Get all children except the first one (function name)
  const args = (callNode.children || []).slice(1);
  console.log('Args:', args.map(a => `${a.type}: ${JSON.stringify(a.text)}`));
  let argText = args[0]?.text || '';
  console.log('Initial argText:', JSON.stringify(argText));
  argText = argText.trim();
  if (argText.startsWith('(') && argText.endsWith(')')) {
    argText = argText.slice(1, -1).trim();
  }
  if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith("'") && argText.endsWith("'"))) {
    argText = argText.slice(1, -1);
  }
  console.log('Final prompt:', JSON.stringify(argText));
}