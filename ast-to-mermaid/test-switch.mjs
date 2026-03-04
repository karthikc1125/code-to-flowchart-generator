import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

const parser = new Parser();
parser.setLanguage(JavaScript);

const tree = parser.parse(`
switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  default:
    console.log("Default");
    break;
}
`);

function printNode(node, indent = '') {
  console.log(`${indent}${node.type} ${node.named ? (node.text.replace(/\\n/g, '\\\\n').substring(0, 30)) : ''}`);
  for (const child of node.children) {
    printNode(child, indent + '  ');
  }
}

printNode(tree.rootNode);
