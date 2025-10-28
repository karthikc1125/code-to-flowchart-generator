// Debug expression_statement processing
import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const pyCode = `name = input("What is your name? ")`;
const tree = parser.parse(pyCode);
const exprStmt = tree.rootNode.child(0); // Get the expression_statement node

console.log('Expression statement node:');
console.log('  Type:', exprStmt.type);
console.log('  Text:', JSON.stringify(exprStmt.text));

console.log('\nChildren:');
for (let i = 0; i < exprStmt.childCount; i++) {
  const child = exprStmt.child(i);
  console.log(`  ${i}: ${child.type} - ${JSON.stringify(child.text)}`);
}

console.log('\n=== Testing pythonConfig.isInputCall ===');
const isInput = pythonConfig.isInputCall(exprStmt);
console.log('isInputCall result:', isInput);

console.log('\n=== Testing pythonConfig.extractInputInfo ===');
const inputInfo = pythonConfig.extractInputInfo(exprStmt);
console.log('extractInputInfo result:', inputInfo);

// Let's manually check what happens for expression_statement
console.log('\n=== Manual check for expression_statement ===');
const callChild = exprStmt.children.find(c => c.type === 'call');
console.log('Call child:', callChild ? `${callChild.type}: ${JSON.stringify(callChild.text)}` : 'null');

if (callChild) {
  // This is what the extractInputInfo function does for expression_statement
  // callExpr = findInputCall(node.children.find(c => c.type === 'call'));
  // But findInputCall expects to be called on the call node directly
  console.log('This approach is wrong - we should call findInputCall on the callChild directly');
  
  // Let's test the correct approach
  const callExpr = callChild; // This is what we should be using
  if (callExpr) {
    // Extract the prompt manually
    const args = (callExpr.children || []).slice(1);
    let argText = args[0]?.text || '';
    argText = argText.trim();
    if (argText.startsWith('(') && argText.endsWith(')')) {
      argText = argText.slice(1, -1).trim();
    }
    if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith("'") && argText.endsWith("'"))) {
      argText = argText.slice(1, -1);
    }
    console.log('Manual prompt extraction:', JSON.stringify(argText));
  }
}