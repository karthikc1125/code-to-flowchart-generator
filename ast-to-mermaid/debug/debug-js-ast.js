import Parser from 'tree-sitter';
import JavaScriptGrammar from 'tree-sitter-javascript';

const jsCode = `
let x = 10;

if (x > 0) {
    console.log("Positive number");
} else if (x < 0) {
    console.log("Negative number");
} else {
    console.log("Zero");
}

console.log("End of program");
`;

const parser = new Parser();
parser.setLanguage(JavaScriptGrammar);

const tree = parser.parse(jsCode);
console.log('JavaScript AST for if/else if/else:');
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