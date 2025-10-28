import { pythonConfig } from './src/mappings/python-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
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

console.log('Processing Python if/elif/else statements:');
console.log('Root node type:', rootNode.type);

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
  console.log('if_statement children:');
  for (let i = 0; i < ifStatement.childCount; i++) {
    const child = ifStatement.child(i);
    console.log(`  ${i}: ${child.type} - "${child.text.substring(0, 30)}"`);
  }
  
  // Check if it's recognized as a conditional
  const isConditional = pythonConfig.isConditional(ifStatement);
  console.log('isConditional:', isConditional);
  
  // Check the condition info
  if (isConditional) {
    const condInfo = pythonConfig.extractConditionInfo(ifStatement);
    console.log('Condition info:', condInfo);
    
    // Check the then branch
    const thenBranch = pythonConfig.extractThenBranch(ifStatement);
    console.log('Then branch:', thenBranch);
    
    // Check the else branch
    const elseBranch = pythonConfig.extractElseBranch(ifStatement);
    console.log('Else branch:', elseBranch);
    
    // Check if there's an elif clause
    const elifClause = ifStatement.children.find(c => c.type === 'elif_clause');
    console.log('Elif clause:', elifClause ? elifClause.type : 'null');
    if (elifClause) {
      console.log('Elif clause children:');
      for (let i = 0; i < elifClause.childCount; i++) {
        const child = elifClause.child(i);
        console.log(`  ${i}: ${child.type} - "${child.text.substring(0, 30)}"`);
      }
    }
  }
}