// Test Python match statement processing in common flowchart generator
import { pythonConfig } from './src/mappings/python-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';

const pyCode = `
x = 2
match x:
    case 1:
        print("One")
    case 2:
        print("Two")
    case _:
        print("Other")
print("End of program")
`;

// Parse the code
const parser = new Parser();
parser.setLanguage(Python);
const tree = parser.parse(pyCode);
const rootNode = tree.rootNode;

console.log('Python AST Root Type:', rootNode.type);
console.log('Python AST Children:');
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
    const mermaid = generateCommonFlowchart(nodes, pythonConfig);
    console.log('Generated Mermaid:');
    console.log(mermaid);
} catch (error) {
    console.error('Error in common flowchart generator:', error.message);
    console.error(error.stack);
}