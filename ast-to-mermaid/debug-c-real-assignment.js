import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { cConfig } from './src/mappings/c-config.mjs';

const code = `
#include <stdio.h>

int main() {
    char ch;
    int x = 5;  // This is a declaration with initialization
    int y;      // This is just a declaration
    
    ch = 'a';   // This is a pure assignment
    
    printf("Enter a character: ");
    scanf(" %c", &ch);
    
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
        printf("%c is a Vowel\\n", ch);
    } else {
        printf("%c is a Consonant\\n", ch);
    }
    
    y = 10;     // This is another pure assignment
    
    return 0;
}
`;

const parser = new Parser();
parser.setLanguage(C);

const tree = parser.parse(code);
console.log('C AST for test-assignment.c:');
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
  }
});