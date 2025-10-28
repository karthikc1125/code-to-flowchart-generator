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
console.log('Python AST for if/elif/else:');
console.log(tree.rootNode.toString());

// Let's also look at the structure in a more readable way
function traverse(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node.type}: "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"`);
  
  for (let i = 0; i < node.childCount; i++) {
    traverse(node.child(i), depth + 1);
  }
}

console.log('\nDetailed AST structure:');
traverse(tree.rootNode);