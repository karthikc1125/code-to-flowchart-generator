import Parser from 'tree-sitter';
import C from 'tree-sitter-c';

const parser = new Parser();
parser.setLanguage(C);

const sourceCode = `
int main() {
    int i = 0;
    do {
        printf("test");
        i++;
    } while (i < 3);
    return 0;
}
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());