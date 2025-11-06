import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

const code = `
public class Test {
    public static void main(String[] args) {
        int x = 5;           // Regular variable with initialization
        int y;               // Regular variable without initialization
        char ch = 'a';       // Char variable with initialization
        String str;          // String without initialization
    }
}
`;

const parser = new Parser();
parser.setLanguage(Java);

const tree = parser.parse(code);
console.log('Java AST for variable declarations:');
console.log(tree.rootNode.toString());