import { pythonConfig } from './src/mappings/python-config.mjs';
import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);

// Find the assignment nodes directly
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
  
  const isInputResult = pythonConfig.isInputCall(assignment);
  console.log(`  isInputCall result: ${isInputResult}`);
  
  if (isInputResult) {
    const inputInfo = pythonConfig.extractInputInfo(assignment);
    console.log(`  Input info:`, inputInfo);
  }
  
  // Let's manually check the children
  console.log(`  Children: ${assignment.children.map(c => c.type).join(', ')}`);
  for (const child of assignment.children) {
    console.log(`    ${child.type}: ${JSON.stringify(child.text.substring(0, 30))}`);
    if (child.type === 'call') {
      const callee = child.child(0)?.text || '';
      console.log(`      Call to: ${callee}`);
      const isInput = /\binput\b|\bread\b|\braw_input\b/i.test(callee);
      console.log(`      Is input call: ${isInput}`);
    }
  }
}