import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';

const pyCode = `name = input("What is your name? ")`;

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

console.log('Root node type:', rootNode.type);
console.log('Root node children:', rootNode.childCount);

const exprStmt = rootNode.child(0);
console.log('Expression statement type:', exprStmt.type);
console.log('Expression statement children:', exprStmt.childCount);

const assignment = exprStmt.child(0);
console.log('Assignment type:', assignment.type);
console.log('Assignment text:', assignment.text);

// Test the isInputCall function
const result = pythonConfig.isInputCall(assignment);
console.log('isInputCall result:', result);