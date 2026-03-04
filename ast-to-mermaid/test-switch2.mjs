import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { createFlowBuilder } from './src/mappings/_common.mjs';
import { processConditionalChain, processSingleConditional } from './src/mappings/conditional-mapping.mjs';
import { normalizeTree } from './src/normalize.mjs';

const parser = new Parser();
parser.setLanguage(JavaScript);

const tree = parser.parse(`
switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  default:
    console.log("Default");
    break;
}
`);

const normalizedRoot = normalizeTree(tree);
const switchNode = normalizedRoot.children[0];

const flow = createFlowBuilder();

import { mapSwitch } from './src/mappings/statements/conditional/switch.mjs';

const mapper = {
  getCondition: (n) => (javascriptConfig.extractConditionInfo(n))?.text || 'condition',
  getThenBranch: (n) => (javascriptConfig.extractThenBranch(n))?.calls || [],
  getElseBranch: (n) => (javascriptConfig.extractElseBranch(n))?.calls || []
};

const processSequence = (nodes, startId, label) => {
  let currentId = startId;
  let currentLabel = label;
  for (const stmt of nodes) {
    if (stmt.type === 'break_statement') {
      const id = flow.addBreakStatement(stmt, 'break');
      flow.link(currentId, id, currentLabel);
      currentId = id;
      currentLabel = "";
    } else if (stmt.type === 'expression_statement') {
      const id = flow.addAction(stmt, stmt.text.replace(/\\n/g, '').substring(0, 30));
      flow.link(currentId, id, currentLabel);
      currentId = id;
      currentLabel = "";
    }
  }
  return { lastIds: [currentId], exitLabels: [""] };
};

const result = mapSwitch(switchNode, {
  builder: flow,
  prevId: 'START',
  entryLabel: '',
  mapper,
  processSequence
});

console.log(flow.toString());
