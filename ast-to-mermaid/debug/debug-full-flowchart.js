import { pythonConfig } from './src/mappings/python-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
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
const nodes = [tree.rootNode];

console.log('Generating flowchart with debug info:');

// Monkey patch console.log to see what's happening
const originalLog = console.log;
console.log = function(...args) {
  // Filter out some of the noise
  if (!args[0].includes('flowchart TD') && !args[0].includes('-->')) {
    originalLog(...args);
  }
};

const result = generateCommonFlowchart(nodes, pythonConfig);
console.log = originalLog;

console.log('\nGenerated Mermaid:');
console.log(result);