import { createFlowBuilder } from './src/mappings/_common.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';
import { normalizeTree } from './src/normalize.mjs';

import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';

const parser = new Parser();
parser.setLanguage(Python);

const code = `
for i in range(5):
    print("Outer")
    while j < 5:
        print("Inner")
        j += 1
`;

const tree = parser.parse(code);
const normalizedTree = normalizeTree(tree);

const flowchart = generateCommonFlowchart([normalizedTree], pythonConfig);
console.log(flowchart);
