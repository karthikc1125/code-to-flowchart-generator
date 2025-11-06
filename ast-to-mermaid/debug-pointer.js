import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import { cConfig } from './src/mappings/c-config.mjs';

const code = `
#include <stdio.h>

int main() {
    int x = 5;           // Regular variable with initialization
    int y;               // Regular variable without initialization
    int *ptr;            // Pointer declaration without initialization
    int *ptr2 = &x;      // Pointer declaration with initialization
    char ch = 'a';       // Char variable with initialization
    char *str;           // Char pointer without initialization
    
    printf("Testing pointer declarations\\n");
    
    return 0;
}
`;

const parser = new Parser();
parser.setLanguage(C);

const tree = parser.parse(code);
console.log('C AST for pointer declarations:');
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