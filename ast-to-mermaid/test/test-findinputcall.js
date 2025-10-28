// Test the findInputCall function from pythonConfig
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

// Copy the findInputCall function from pythonConfig
const findInputCall = (n) => {
  if (!n) return null;
  if (n.type === 'call') {
    // Get the first child which should be the function name
    const calleeNode = n.children && n.children.length > 0 ? n.children[0] : null;
    const callee = textOf(calleeNode);
    console.log('  Checking call node, callee:', callee);
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
};

console.log('\n=== Testing findInputCall on assignment ===');
const result = findInputCall(assignment);
console.log('Result:', result ? `${result.type}: ${JSON.stringify(result.text)}` : 'null');