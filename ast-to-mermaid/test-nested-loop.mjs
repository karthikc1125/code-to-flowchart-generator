import { createFlowBuilder } from './src/mappings/_common.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { normalizeTree } from './src/normalize.mjs';

import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

const parser = new Parser();
parser.setLanguage(JavaScript);

const code = `
for (let i = 0; i < 5; i++) {
  console.log(i);
  for (let j = 0; j < 5; j++) {
    console.log(j);
  }
}
`;

const tree = parser.parse(code);
const normalizedTree = normalizeTree(tree);
const flowchart = generateCommonFlowchart([normalizedTree], javascriptConfig);
console.log(flowchart);
