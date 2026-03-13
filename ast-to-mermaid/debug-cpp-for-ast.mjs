import Parser from 'tree-sitter';
import Cpp from 'tree-sitter-cpp';

const parser = new Parser();
parser.setLanguage(Cpp);

const code = `
#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {1, 2, 3};
    for (int val : arr) {
        std::cout << val << std::endl;
    }
    return 0;
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
