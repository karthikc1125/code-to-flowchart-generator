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
    console.log('Elif clause children (all):');
    for (let i = 0; i < elifClause.childCount; i++) {
      const child = elifClause.child(i);
      console.log(`  ${i}: ${child.type} - named: ${child.named} - "${child.text.substring(0, 30)}"`);
    }
    
    // Find all named children
    console.log('\nNamed children only:');
    for (let i = 0; i < elifClause.childCount; i++) {
      const child = elifClause.child(i);
      if (child.named) {
        console.log(`  ${i}: ${child.type} - "${child.text.substring(0, 30)}"`);
      }
    }
  }
}