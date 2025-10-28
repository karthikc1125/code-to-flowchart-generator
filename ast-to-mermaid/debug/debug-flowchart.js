import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');

const parser = new Parser();
parser.setLanguage(PythonGrammar);

console.log('=== PYTHON CODE ===');
console.log(pyCode);

const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

console.log('\n=== PROCESSING NODES IN FLOWCHART GENERATOR ===');

// Simulate what happens in common-flowchart.mjs
const candidateNodes = rootNode.children || [];

const processedNodes = new Set();

for (const node of candidateNodes) {
  if (!node) continue;
  if (processedNodes.has(node)) continue;
  
  console.log(`\nProcessing node type: ${node.type}`);
  console.log(`  Text: ${JSON.stringify(node.text)}`);
  
  // Check if it's an input call
  if (pythonConfig.isInputCall && pythonConfig.isInputCall(node)) {
    console.log(`  -> DETECTED AS INPUT CALL`);
    const inputInfo = pythonConfig.extractInputInfo ? pythonConfig.extractInputInfo(node) : { prompt: '' };
    console.log(`  -> Input info:`, inputInfo);
    processedNodes.add(node);
    continue;
  }
  
  // Check if it's an assignment
  if (pythonConfig.isAssignment && pythonConfig.isAssignment(node)) {
    console.log(`  -> DETECTED AS ASSIGNMENT`);
    const varInfo = pythonConfig.extractVariableInfo ? pythonConfig.extractVariableInfo(node) : null;
    console.log(`  -> Variable info:`, varInfo);
    processedNodes.add(node);
    continue;
  }
  
  // Check if it's an output call
  if (pythonConfig.isOutputCall && pythonConfig.isOutputCall(node)) {
    console.log(`  -> DETECTED AS OUTPUT CALL`);
    const outputInfo = pythonConfig.extractOutputInfo ? pythonConfig.extractOutputInfo(node) : null;
    console.log(`  -> Output info:`, outputInfo);
    processedNodes.add(node);
    continue;
  }
  
  console.log(`  -> Not specifically handled`);
}