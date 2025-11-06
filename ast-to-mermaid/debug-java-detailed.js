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
    console.log(`\nStatement ${index}: ${node.type}`);
    console.log(`  Text: ${node.text?.substring(0, 100) || ''}`);
    
    // Check if it's an assignment
    if (javaConfig.isAssignment(node)) {
      console.log(`  -> This is an assignment!`);
      const varInfo = javaConfig.extractVariableInfo(node);
      console.log(`  -> Variable info:`, varInfo);
      
      // Print parent information for debugging
      if (node.parent) {
        console.log(`  -> Parent type: ${node.parent.type}`);
        console.log(`  -> Parent text: ${node.parent.text?.substring(0, 100) || ''}`);
        if (node.parent.children) {
          console.log(`  -> Parent children types:`, node.parent.children.map(c => c?.type || 'null'));
        }
      }
    }
  }
});