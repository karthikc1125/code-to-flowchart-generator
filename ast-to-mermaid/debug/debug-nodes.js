// Debug the common flowchart generator with switch statement
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

const jsCode = `
let x = 2;
switch (x) {
    case 1:
        console.log("One");
        break;
    case 2:
        console.log("Two");
        break;
    default:
        console.log("Other");
}
console.log("End of program");
`;

// Parse the code
const parser = new Parser();
parser.setLanguage(JavaScript);
const tree = parser.parse(jsCode);
const rootNode = tree.rootNode;

// Extract nodes for common flowchart generator
const nodes = [];
function walk(node) {
    if (node) {
        nodes.push(node);
        for (const child of node.children || []) {
            walk(child);
        }
    }
}
walk(rootNode);

console.log('=== NODES BEING PROCESSED ===');
nodes.forEach((node, index) => {
    console.log(`${index}: ${node.type}`);
    if (node.type === 'switch_statement') {
        console.log('  >>> SWITCH STATEMENT DETECTED <<<');
        console.log('  isConditional:', javascriptConfig.isConditional(node));
        
        // Test extract functions
        const thenInfo = javascriptConfig.extractThenBranch(node);
        console.log('  extractThenBranch calls:', thenInfo.calls.length);
        thenInfo.calls.forEach((call, callIndex) => {
            console.log(`    Call ${callIndex}: ${call.type}`);
        });
        
        const elseInfo = javascriptConfig.extractElseBranch(node);
        console.log('  extractElseBranch calls:', elseInfo.calls.length);
    }
});