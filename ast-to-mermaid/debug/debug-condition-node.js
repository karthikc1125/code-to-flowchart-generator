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
  // Check for elif_clause
  const elifClause = ifStatement.children.find(c => c.type === 'elif_clause');
  if (elifClause) {
    console.log('Elif clause children (detailed):');
    for (let i = 0; i < elifClause.childCount; i++) {
      const child = elifClause.child(i);
      console.log(`  ${i}: ${child.type}`);
      console.log(`     Text: "${child.text}"`);
      console.log(`     Named: ${child.named}`);
      console.log(`     Child count: ${child.childCount}`);
      
      // Check children of each child
      if (child.childCount > 0) {
        console.log('     Children:');
        for (let j = 0; j < child.childCount; j++) {
          const grandchild = child.child(j);
          console.log(`       ${j}: ${grandchild.type} - "${grandchild.text}"`);
        }
      }
      console.log();
    }
    
    // Try to find the condition by looking at the comparison_operator
    const conditionNode = elifClause.children.find(c => c.type === 'comparison_operator');
    if (conditionNode) {
      console.log('Found condition node:', conditionNode.type);
      console.log('Condition text:', conditionNode.text);
    }
  }
}