// Debug the flowchart generation process
import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';
import fs from 'fs';

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');
const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

console.log('=== PROCESSING NODES ===');

// Simulate what happens in common-flowchart.mjs
const candidateNodes = rootNode.children || [];

for (const node of candidateNodes) {
  if (!node) continue;
  
  console.log(`\nProcessing node type: ${node.type}`);
  console.log(`  Text: ${JSON.stringify(node.text)}`);
  
  // Handle input operations FIRST (before assignments)
  if (pythonConfig.isInputCall && pythonConfig.isInputCall(node)) {
    console.log(`  -> DETECTED AS INPUT CALL`);
    const inputInfo = pythonConfig.extractInputInfo ? pythonConfig.extractInputInfo(node) : { prompt: '' };
    console.log(`  -> Input info:`, inputInfo);
    const label = inputInfo && inputInfo.prompt ? `read input: ${inputInfo.prompt}` : 'read input';
    console.log(`  -> Label would be: ${label}`);
    continue;
  }

  // Handle variable declarations and assignments
  if (pythonConfig.isAssignment && pythonConfig.isAssignment(node)) {
    console.log(`  -> DETECTED AS ASSIGNMENT`);
    const varInfo = pythonConfig.extractVariableInfo ? pythonConfig.extractVariableInfo(node) : null;
    console.log(`  -> Variable info:`, varInfo);
    continue;
  }
}