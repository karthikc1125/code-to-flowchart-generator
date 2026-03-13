import Parser from 'tree-sitter';
import Cpp from 'tree-sitter-cpp';

const parser = new Parser();
parser.setLanguage(Cpp);

const code = `
int main() {
    int i = 0;
    do {
        cout << i << endl;
        i++;
    } while (i < 5);
    return 0;
}
`;

const tree = parser.parse(code);

function printTree(node, indent = 0) {
    if (!node) return;
    const isNamed = node.isNamed ? " (named)" : "";
    console.log(`${" ".repeat(indent)}${node.type}${isNamed} - ${node.text.replace(/\n/g, '\\n').substring(0, 30)}`);
    for (let c of node.children) {
        printTree(c, indent + 2);
    }
}

printTree(tree.rootNode);
