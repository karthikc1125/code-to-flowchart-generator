import Parser from 'tree-sitter';
import PythonGrammar from 'tree-sitter-python';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');

const parser = new Parser();
parser.setLanguage(PythonGrammar);

const tree = parser.parse(pyCode);

// Find the second assignment node
function findSecondAssignment(node) {
  if (node.type === 'assignment') {
    const text = node.text;
    if (text.includes('int(input')) {
      return node;
    }
  }
  for (let i = 0; i < node.childCount; i++) {
    const result = findSecondAssignment(node.child(i));
    if (result) return result;
  }
  return null;
}

const assignment = findSecondAssignment(tree.rootNode);

// Find the call node within the assignment
function findCallNode(node) {
  if (node.type === 'call') {
    return node;
  }
  for (let i = 0; i < node.childCount; i++) {
    const result = findCallNode(node.child(i));
    if (result) return result;
  }
  return null;
}

const callNode = findCallNode(assignment);
console.log('Call node:', callNode.type);
console.log('Call text:', JSON.stringify(callNode.text));

console.log('\nCall node children:');
for (let i = 0; i < callNode.childCount; i++) {
  const child = callNode.child(i);
  console.log(`  ${i}: ${child.type} - ${JSON.stringify(child.text)}`);
  if (child.type === 'argument_list' && child.children) {
    console.log('    Argument list children:');
    for (let j = 0; j < child.childCount; j++) {
      const argChild = child.child(j);
      console.log(`      ${j}: ${argChild.type} - ${JSON.stringify(argChild.text)}`);
      // Look deeper into the argument list
      if (argChild.children) {
        for (let k = 0; k < argChild.childCount; k++) {
          const deepChild = argChild.child(k);
          console.log(`        ${k}: ${deepChild.type} - ${JSON.stringify(deepChild.text)}`);
          if (deepChild.type === 'call') {
            console.log('          Found nested call!');
            for (let l = 0; l < deepChild.childCount; l++) {
              const deepestChild = deepChild.child(l);
              console.log(`            ${l}: ${deepestChild.type} - ${JSON.stringify(deepestChild.text)}`);
            }
          }
        }
      }
    }
  }
}