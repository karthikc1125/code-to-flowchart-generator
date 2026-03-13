import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

const parser = new Parser();
parser.setLanguage(Java);

const code = `
class Test {
    public static void main(String[] args) {
        String[] arr = {"a", "b", "c"};
        for (String val : arr) {
            System.out.println(val);
        }
    }
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
