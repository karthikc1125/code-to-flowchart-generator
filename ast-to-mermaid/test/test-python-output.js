// Test Python isOutputCall function
import { pythonConfig } from './src/mappings/python-config.mjs';
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

// Extract all call nodes
const callNodes = [];
function walk(node) {
    if (node) {
        if (node.type === 'call') {
            callNodes.push(node);
        }
        for (const child of node.children || []) {
            walk(child);
        }
    }
}
walk(rootNode);

console.log('=== CALL NODES ===');
callNodes.forEach((callNode, index) => {
    console.log(`Call ${index}:`);
    console.log('  Type:', callNode.type);
    console.log('  Text:', callNode.text);
    console.log('  Children:');
    callNode.children.forEach((child, childIndex) => {
        console.log(`    ${childIndex}: ${child.type} - "${child.text}"`);
    });
    
    console.log('  isOutputCall:', pythonConfig.isOutputCall(callNode));
    if (pythonConfig.isOutputCall(callNode)) {
        const outputInfo = pythonConfig.extractOutputInfo(callNode);
        console.log('  extractOutputInfo:', outputInfo);
    }
});