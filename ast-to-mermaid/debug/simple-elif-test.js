import { createFlowBuilder } from './src/mappings/_common.mjs';

// Test creating an elif node directly
const flow = createFlowBuilder();
const start = flow.addStart();
const ifNode = flow.addIfStatement('if1', 'x > 0?');
flow.link(start, ifNode);

// Add an elif node
const elifNode = flow.addElseIfStatement('elif1', 'x < 0?');
flow.link(ifNode, elifNode, 'no');

// Add some action nodes
const action1 = flow.addAction('action1', 'print "Positive"');
flow.link(ifNode, action1, 'yes');

const action2 = flow.addAction('action2', 'print "Negative"');
flow.link(elifNode, action2, 'yes');

const end = flow.addEnd();
flow.link(action1, end);
flow.link(action2, end);
flow.link(elifNode, end, 'no');

console.log('Simple elif test:');
console.log(flow.toString());