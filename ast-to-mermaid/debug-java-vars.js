import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';
import { javaConfig } from './src/mappings/java-config.mjs';

const code = `
public class Test {
    public static void main(String[] args) {
        int x = 5;           // Regular variable with initialization
        int y;               // Regular variable without initialization
        char ch = 'a';       // Char variable with initialization
        String str;          // String without initialization
        
        System.out.println("Testing variable declarations");
        
        return;
    }
}
`;

const parser = new Parser();
parser.setLanguage(Java);

const tree = parser.parse(code);
console.log('Java AST for variable declarations:');
console.log(tree.rootNode.toString());

// Let's also check what statements are being identified
console.log('\n\nChecking statement identification:');

const rootNode = tree.rootNode;
const statementNodes = javaConfig.findStatementNodes(rootNode);

console.log('Number of statement nodes found:', statementNodes.length);
statementNodes.forEach((node, index) => {
  if (node) {
    console.log(`Statement ${index}: ${node.type} - ${node.text?.substring(0, 50) || ''}`);
    
    // Check if it's an assignment
    if (javaConfig.isAssignment(node)) {
      console.log(`  -> This is an assignment!`);
      const varInfo = javaConfig.extractVariableInfo(node);
      console.log(`  -> Variable info:`, varInfo);
    }
  }
});