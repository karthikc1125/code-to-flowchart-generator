import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { createFlowBuilder } from './src/mappings/_common.mjs';
import { processSingleLoop } from './src/mappings/loop-mapping.mjs';
import { normalizeTree } from './src/normalize.mjs';

const parser = new Parser();
parser.setLanguage(JavaScript);

const tree = parser.parse(`
do {
  console.log(i);
  i++;
} while(i < 5);
`);

const normalizedRoot = normalizeTree(tree);
const loopNode = normalizedRoot.children[0];

const flow = createFlowBuilder();

// Start node mock
const startId = flow.addStart();

const processSequence = (nodes, currentStartId, currentLabel) => {
  let currentId = currentStartId;
  let label = currentLabel || "";
  for (const stmt of nodes) {
    if (stmt.type === 'expression_statement') {
      const id = flow.addAction(stmt, stmt.text.replace(/\\n/g, '').substring(0, 30));
      flow.link(currentId, id, label);
      currentId = id;
      label = "";
    }
  }
  return { last: currentId }; 
};

console.log("LOOP INFO:", javascriptConfig.extractLoopInfo(loopNode));

const result = processSingleLoop(loopNode, flow, javascriptConfig, startId, '', processSequence);

// End node mock
const endId = flow.addEnd();
flow.link(result.last, endId);

flow.finalize(endId);

console.log(flow.toString());
