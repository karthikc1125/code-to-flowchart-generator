import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

const sourceCode = `
public class NestedConditionalTest {
    public static void main(String[] args) {
        int x = 5;
        int y = 10;
        
        if (x > 0) {
            if (y > 5) {
                System.out.println("Both positive");
            } else {
                System.out.println("X positive, Y not greater than 5");
            }
        } else if (x == 0) {
            System.out.println("X is zero");
        } else {
            System.out.println("X is negative");
        }
        
        System.out.println("End of program");
    }
}
`;

const parser = new Parser();
parser.setLanguage(Java);

const tree = parser.parse(sourceCode);

// Function to print the AST structure
function printAST(node, indent = 0) {
  const spaces = ' '.repeat(indent);
  console.log(`${spaces}${node.type}: "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"`);
  
  if (node.children) {
    for (const child of node.children) {
      if (child) {
        printAST(child, indent + 2);
      }
    }
  }
}

console.log('AST Structure:');
printAST(tree.rootNode);