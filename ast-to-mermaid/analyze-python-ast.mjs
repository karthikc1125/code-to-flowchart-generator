import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';

const parser = new Parser();
parser.setLanguage(Python);

const sourceCode = `
i = 0
while i < 3:
    print("Iteration:", i)
    i += 1
print("Loop finished")
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());