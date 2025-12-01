import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

const parser = new Parser();
parser.setLanguage(JavaScript);

const sourceCode = `
do {
    console.log("Do-while loop iteration");
} while (condition);
`;

const tree = parser.parse(sourceCode);
console.log('AST for do-while:');
console.log(tree.rootNode.toString());