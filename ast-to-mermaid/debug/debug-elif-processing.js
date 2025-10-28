import { pythonConfig } from './src/mappings/python-config.mjs';
import { createFlowBuilder } from './src/mappings/_common.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const pyCode = `
x = 10

if x > 0:
    print("Positive number")
elif x < 0:
    print("Negative number")
else:
    print("Zero")

print("End of program")
`;

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

// Find the if_statement node
function findIfStatement(node) {
  if (node.type === 'if_statement') {
    return node;
  }
  for (let i = 0; i < node.childCount; i++) {
    const result = findIfStatement(node.child(i));
    if (result) return result;
  }
  return null;
}

const ifStatement = findIfStatement(rootNode);
console.log('Found if_statement node:', ifStatement ? ifStatement.type : 'null');

if (ifStatement) {
  console.log('\nif_statement children:');
  for (let i = 0; i < ifStatement.childCount; i++) {
    const child = ifStatement.child(i);
    console.log(`  ${i}: ${child.type} - "${child.text.substring(0, 30)}"`);
  }
  
  // Check for elif_clause
  const elifClause = ifStatement.children.find(c => c.type === 'elif_clause');
  console.log('\nElif clause found:', elifClause ? 'Yes' : 'No');
  if (elifClause) {
    console.log('Elif clause children:');
    for (let i = 0; i < elifClause.childCount; i++) {
      const child = elifClause.child(i);
      console.log(`  ${i}: ${child.type} - "${child.text.substring(0, 30)}"`);
    }
    
    // Try to extract condition from elif clause
    const conditionNode = elifClause.children.find(c => c && c.named);
    console.log('\nElif condition:', conditionNode ? conditionNode.text : 'null');
    
    // Try to extract block from elif clause
    const blockNode = elifClause.children.find(c => c && c.type === 'block');
    console.log('Elif block found:', blockNode ? 'Yes' : 'No');
    if (blockNode) {
      console.log('Elif block children:');
      for (let i = 0; i < blockNode.childCount; i++) {
        const child = blockNode.child(i);
        console.log(`  ${i}: ${child.type} - "${child.text.substring(0, 30)}"`);
      }
      
      // Find calls in elif block
      function findAll(node, type) {
        const results = [];
        if (!node) return results;
        if (node.type === type) results.push(node);
        for (const c of node.children || []) {
          results.push(...findAll(c, type));
        }
        return results;
      }
      
      const calls = findAll(blockNode, 'call');
      console.log('\nCalls in elif block:', calls.length);
      for (let i = 0; i < calls.length; i++) {
        console.log(`  ${i}: ${calls[i].type} - "${calls[i].text}"`);
      }
    }
  }
}