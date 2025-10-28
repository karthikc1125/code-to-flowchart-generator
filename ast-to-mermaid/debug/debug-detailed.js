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

console.log('\n=== DETAILED NODE PROCESSING ===');

// Simulate what happens in common-flowchart.mjs
const candidateNodes = rootNode.children || [];

for (const node of candidateNodes) {
  if (!node) continue;
  
  console.log(`\nProcessing node type: ${node.type}`);
  console.log(`  Text: ${JSON.stringify(node.text)}`);
  
  // Check if it's an input call using our function
  const isInputResult = pythonConfig.isInputCall(node);
  console.log(`  isInputCall result: ${isInputResult}`);
  
  if (isInputResult) {
    const inputInfo = pythonConfig.extractInputInfo ? pythonConfig.extractInputInfo(node) : { prompt: '' };
    console.log(`  Input info:`, inputInfo);
  }
  
  // Let's also manually check what's in the node
  if (node.children) {
    console.log(`  Children types: ${node.children.map(c => c.type).join(', ')}`);
    for (const child of node.children) {
      console.log(`    Child type: ${child.type}, text: ${JSON.stringify(child.text.substring(0, 50))}`);
      if (child.type === 'assignment') {
        const isChildInput = pythonConfig.isInputCall(child);
        console.log(`      Assignment isInputCall: ${isChildInput}`);
      }
    }
  }
}