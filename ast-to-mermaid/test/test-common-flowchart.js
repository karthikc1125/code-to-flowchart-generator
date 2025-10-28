// Test JavaScript switch statement processing in common flowchart generator
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
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

console.log('JavaScript AST Root Type:', rootNode.type);
console.log('JavaScript AST Children:');
rootNode.children.forEach((child, index) => {
    console.log(`  ${index}: ${child.type}`);
});

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

console.log('\n=== Testing Common Flowchart Generator ===');
try {
    const mermaid = generateCommonFlowchart(nodes, javascriptConfig);
    console.log('Generated Mermaid:');
    console.log(mermaid);
} catch (error) {
    console.error('Error in common flowchart generator:', error.message);
    console.error(error.stack);
}