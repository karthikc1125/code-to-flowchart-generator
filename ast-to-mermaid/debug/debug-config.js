// Test the actual pythonConfig functions
import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';
import fs from 'fs';

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');
const tree = parser.parse(pyCode);

// Find the assignment nodes
function findAssignments(node) {
  const assignments = [];
  if (node.type === 'assignment') {
    assignments.push(node);
  }
  for (let i = 0; i < node.childCount; i++) {
    assignments.push(...findAssignments(node.child(i)));
  }
  return assignments;
}

const assignments = findAssignments(tree.rootNode);

console.log(`Found ${assignments.length} assignment nodes`);

for (let i = 0; i < assignments.length; i++) {
  const assignment = assignments[i];
  console.log(`\nAssignment ${i + 1}:`);
  console.log(`  Text: ${JSON.stringify(assignment.text)}`);
  
  const isInput = pythonConfig.isInputCall(assignment);
  console.log(`  isInputCall: ${isInput}`);
  
  if (isInput) {
    const inputInfo = pythonConfig.extractInputInfo(assignment);
    console.log(`  extractInputInfo:`, inputInfo);
  }
}