import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { cConfig } from './src/mappings/c-config.mjs';

const code = `
#include <stdio.h>

int main() {
    char ch;
    
    printf("Enter a character: ");
    scanf(" %c", &ch);
    
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
        printf("%c is a Vowel\\n", ch);
    } else {
        printf("%c is a Consonant\\n", ch);
    }
    
    return 0;
}
`;

const parser = new Parser();
parser.setLanguage(C);

const tree = parser.parse(code);
console.log('C AST for vowel_consonant_test.c:');
console.log(tree.rootNode.toString());

// Let's also check what statements are being identified
console.log('\n\nChecking statement identification:');

const rootNode = tree.rootNode;
const statementNodes = cConfig.findStatementNodes(rootNode);

console.log('Number of statement nodes found:', statementNodes.length);
statementNodes.forEach((node, index) => {
  if (node) {
    console.log(`Statement ${index}: ${node.type} - ${node.text?.substring(0, 50) || ''}`);
    
    // Check if it's an assignment
    if (cConfig.isAssignment(node)) {
      console.log(`  -> This is an assignment!`);
      const varInfo = cConfig.extractVariableInfo(node);
      console.log(`  -> Variable info:`, varInfo);
    }
    
    // Also check for declarations
    if (node.type === 'declaration') {
      console.log(`  -> This is a declaration!`);
      const varInfo = cConfig.extractVariableInfo(node);
      console.log(`  -> Variable info:`, varInfo);
    }
    
    // Check for input operations
    if (cConfig.isInputCall(node)) {
      console.log(`  -> This is an input operation!`);
      const inputInfo = cConfig.extractInputInfo(node);
      console.log(`  -> Input info:`, inputInfo);
    } else {
      console.log(`  -> Not recognized as input call`);
      // Let's check why it's not being recognized
      if (node.type === 'expression_statement') {
        console.log(`    -> Expression statement children:`, node.children?.map(c => c?.type));
        const callExpr = node.children?.find(c => c && c.type === 'call_expression');
        if (callExpr) {
          console.log(`    -> Call expression found`);
          const callee = callExpr.children?.find(c => c && c.named);
          console.log(`    -> Callee:`, callee?.text);
        }
      }
    }
    
    // Check for output operations
    if (cConfig.isOutputCall(node)) {
      console.log(`  -> This is an output operation!`);
      const outputInfo = cConfig.extractOutputInfo(node);
      console.log(`  -> Output info:`, outputInfo);
    } else {
      console.log(`  -> Not recognized as output call`);
      // Let's check why it's not being recognized
      if (node.type === 'expression_statement') {
        console.log(`    -> Expression statement children:`, node.children?.map(c => c?.type));
        const callExpr = node.children?.find(c => c && c.type === 'call_expression');
        if (callExpr) {
          console.log(`    -> Call expression found`);
          const callee = callExpr.children?.find(c => c && c.named);
          console.log(`    -> Callee:`, callee?.text);
        }
      }
    }
  }
});