// Debug the extractInputInfo function step by step
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
  console.log('extractCallLabel called with:', callNode.type, JSON.stringify(callNode.text));
  // Get all children except the first one (function name)
  const args = (callNode.children || []).slice(1);
  console.log('  Args:', args.map(a => `${a.type}: ${JSON.stringify(a.text)}`));
  let argText = args[0]?.text || '';
  console.log('  Initial argText:', JSON.stringify(argText));
  argText = argText.trim();
  if (argText.startsWith('(') && argText.endsWith(')')) {
    argText = argText.slice(1, -1).trim();
  }
  if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith('\'') && argText.endsWith('\''))) {
    argText = argText.slice(1, -1);
  }
  console.log('  Final argText:', JSON.stringify(argText));
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

// Debug the extractInputInfo function
function findInputCall(n) {
  console.log('findInputCall called with:', n.type, JSON.stringify(n.text.substring(0, 30)));
  if (!n) return null;
  if (n.type === 'call') {
    // Get the first child which should be the function name
    const calleeNode = n.children && n.children.length > 0 ? n.children[0] : null;
    const callee = textOf(calleeNode);
    console.log('  Call to:', callee);
    if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
      console.log('  Found input call, returning node');
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
}

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

console.log('\n=== Finding input call ===');
const callNode = findCallNode(assignment);
console.log('Found callNode:', callNode ? `${callNode.type}: ${JSON.stringify(callNode.text)}` : 'null');

const callExpr = findInputCall(callNode);
console.log('Found callExpr:', callExpr ? `${callExpr.type}: ${JSON.stringify(callExpr.text)}` : 'null');

if (callExpr) {
  console.log('\n=== Extracting call label ===');
  const prompt = extractCallLabel(callExpr);
  console.log('Final prompt:', JSON.stringify(prompt));
}