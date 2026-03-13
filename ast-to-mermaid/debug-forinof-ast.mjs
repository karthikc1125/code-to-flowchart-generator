import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

const parser = new Parser();
parser.setLanguage(JavaScript);

const code = `
const obj = { a: 1, b: 2 };
for (const key in obj) {
    console.log(key);
}

const arr = [1, 2, 3];
for (const val of arr) {
    console.log(val);
}
`;

const tree = parser.parse(code);

function printTree(node, indent = 0) {
    if (!node) return;
    const isNamed = node.isNamed ? " (named)" : "";
    console.log(`${" ".repeat(indent)}${node.type}${isNamed} - ${node.text.replace(/\\n/g, '').substring(0, 30)}`);
    for (let c of node.children) {
        printTree(c, indent + 2);
    }
}

printTree(tree.rootNode);
