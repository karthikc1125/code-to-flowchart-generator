import { pythonConfig } from './src/mappings/python-config.mjs';
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

if (ifStatement) {
  console.log('if_statement children types:');
  for (let i = 0; i < ifStatement.childCount; i++) {
    const child = ifStatement.child(i);
    console.log(`  ${i}: ${child.type}`);
  }
  
  // Check for elif clauses
  const elifClauses = ifStatement.children ? ifStatement.children.filter(c => c && c.type === 'elif_clause') : [];
  console.log('\nFound elif clauses:', elifClauses.length);
  
  for (let i = 0; i < elifClauses.length; i++) {
    const elifClause = elifClauses[i];
    console.log(`\nElif clause ${i}:`);
    console.log('  Type:', elifClause.type);
    
    // Check children
    console.log('  Children:');
    for (let j = 0; j < elifClause.childCount; j++) {
      const child = elifClause.child(j);
      console.log(`    ${j}: ${child.type} - "${child.text}"`);
    }
    
    // Try to extract condition
    const conditionNode = elifClause.children.find(c => c && c.type === 'comparison_operator');
    console.log('  Condition node:', conditionNode ? conditionNode.type : 'null');
    if (conditionNode) {
      console.log('  Condition text:', conditionNode.text);
    }
    
    // Try to extract block
    const blockNode = elifClause.children.find(c => c && c.type === 'block');
    console.log('  Block node:', blockNode ? blockNode.type : 'null');
    if (blockNode) {
      console.log('  Block text:', blockNode.text);
      
      // Find calls in block
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
      console.log('  Calls in block:', calls.length);
      for (let k = 0; k < calls.length; k++) {
        console.log(`    ${k}: ${calls[k].type} - "${calls[k].text}"`);
      }
    }
  }
}