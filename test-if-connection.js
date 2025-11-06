import { generateCommonFlowchart } from './ast-to-mermaid/src/mappings/common-flowchart.mjs';
import { javascriptConfig } from './ast-to-mermaid/src/mappings/javascript-config.mjs';
import Parser from 'tree-sitter';
import JavaScriptGrammar from 'tree-sitter-javascript';

// Test code with if statement that should cause multiple connections from start node
const jsCode = `
let a = 1;
if (a > 0) {
  a = 2;
} else {
  a = 3;
}
console.log(a);
`;

const parser = new Parser();
parser.setLanguage(JavaScriptGrammar);

const tree = parser.parse(jsCode);

console.log('Testing if statement connection logic:');
console.log('Code:', jsCode);
console.log('\nGenerated flowchart:');

const flowchart = generateCommonFlowchart(tree.rootNode, javascriptConfig);
console.log(flowchart);