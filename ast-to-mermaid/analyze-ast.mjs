import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

const parser = new Parser();
parser.setLanguage(Java);

const sourceCode = `
public class Test {
    public static void main(String[] args) {
        int i = 0;
        do {
            System.out.println("Iteration: " + i);
            i++;
        } while (i < 3);
    }
}
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());