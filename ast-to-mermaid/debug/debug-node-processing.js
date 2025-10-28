import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const pyCode = `
x = 10

if x > 0:
    print("Positive number")
elif x < 0:
    print("Negative number")
else:
    print("Zero")

print("End of program")
`;

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

console.log('All nodes in the tree:');
function traverse(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node.type}: "${node.text.substring(0, 30)}${node.text.length > 30 ? '...' : ''}"`);
  
  // Check if this node is a conditional
  if (pythonConfig.isConditional && pythonConfig.isConditional(node)) {
    console.log(`${indent}  *** IS CONDITIONAL ***`);
  }
  
  for (let i = 0; i < node.childCount; i++) {
    traverse(node.child(i), depth + 1);
  }
}

traverse(rootNode);