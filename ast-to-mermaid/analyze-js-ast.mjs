import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

const parser = new Parser();
parser.setLanguage(JavaScript);

const sourceCode = `
do {
    console.log("test");
} while (true);
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());