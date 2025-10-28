import { createFlowBuilder } from './src/mappings/_common.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const pyCode = `
if x > 0:
    print("Positive number")
elif x < 0:
    print("Negative number")
else:
    print("Zero")
`;

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);
const ifStatement = tree.rootNode.child(0); // Get the if_statement node

console.log('Testing elif processing logic:');

// Create flowchart manually using our logic
const flow = createFlowBuilder();
const start = flow.addStart();

// Add if node
const ifId = flow.addIfStatement(ifStatement, 'x > 0?');
flow.link(start, ifId);

// Process then branch
const thenAction = flow.addAction('then', 'print "Positive number"');
flow.link(ifId, thenAction, 'yes');

// Process elif clause
const elifClause = ifStatement.children.find(c => c && c.type === 'elif_clause');
if (elifClause) {
  console.log('Found elif clause, processing...');
  
  // Extract condition
  const conditionNode = elifClause.children.find(c => c && c.type === 'comparison_operator');
  const elifConditionText = conditionNode ? conditionNode.text : 'condition';
  console.log('Elif condition:', elifConditionText);
  
  // Create elif node
  const elifId = flow.addElseIfStatement(elifClause, `${elifConditionText}?`);
  flow.link(ifId, elifId, 'no');
  
  // Process elif body
  const blockNode = elifClause.children.find(c => c && c.type === 'block');
  if (blockNode) {
    console.log('Found elif block, processing calls...');
    
    // Simple function to find calls
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
    console.log('Found calls in elif block:', calls.length);
    
    if (calls.length > 0) {
      const elifAction = flow.addAction('elif_action', 'print "Negative number"');
      flow.link(elifId, elifAction, 'yes');
      flow.linkToEnd(elifAction);
    } else {
      flow.linkToEnd(elifId, 'yes');
    }
    
    // Connect elif to end with 'no' (for else branch)
    flow.linkToEnd(elifId, 'no');
  }
}

// Process else clause
const elseClause = ifStatement.children.find(c => c && c.type === 'else_clause');
if (elseClause) {
  console.log('Found else clause, processing...');
  const elseAction = flow.addAction('else', 'print "Zero"');
  // This would link from the last condition, but for simplicity we'll link from ifId
  flow.link(ifId, elseAction, 'no');
  flow.linkToEnd(elseAction);
}

const end = flow.addEnd();
flow.link(thenAction, end);

console.log('\nGenerated flowchart:');
console.log(flow.toString());