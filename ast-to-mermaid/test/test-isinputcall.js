// Test the isInputCall function directly
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

console.log('Testing assignment node:');
console.log('  Type:', assignment.type);
console.log('  Text:', assignment.text);

// Test our isInputCall function
function isInputCall(node) {
  if (!node) return false;
  
  console.log('isInputCall called with node type:', node.type);
  
  if (node.type === 'call') {
    // Get the first child which should be the function name
    const calleeNode = node.children && node.children.length > 0 ? node.children[0] : null;
    const callee = textOf(calleeNode);
    console.log('  Call node, callee:', callee);
    if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
      console.log('  Found input call');
      return true;
    }
    // Check for nested input calls like int(input(...))
    // Recursively check all children, including deep into argument lists
    if (node.children) {
      for (const child of node.children) {
        if (isInputCall(child)) {
          console.log('  Found input call in child');
          return true;
        }
        // Special handling for argument lists which may contain nested calls
        if (child.type === 'argument_list' && child.children) {
          for (const argChild of child.children) {
            if (isInputCall(argChild)) {
              console.log('  Found input call in argument list');
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  
  if (node.type === 'expression_statement') {
    console.log('  Expression statement, checking children');
    // For expression statements, check all children recursively
    if (node.children) {
      for (const child of node.children) {
        if (isInputCall(child)) {
          console.log('  Found input call in expression statement child');
          return true;
        }
      }
    }
    return false;
  }
  
  // Also check for assignments that contain input calls
  if (node.type === 'assignment') {
    console.log('  Assignment node, checking children');
    // Check all children of the assignment
    if (node.children) {
      for (const child of node.children) {
        if (isInputCall(child)) {
          console.log('  Found input call in assignment child');
          return true;
        }
      }
    }
    return false;
  }
  
  console.log('  Not handling this node type');
  return false;
}

const result = isInputCall(assignment);
console.log('\nFinal result:', result);