// Test JavaScript switch statement processing
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

console.log('JavaScript AST Root Type:', rootNode.type);
console.log('JavaScript AST Children Types:');
rootNode.children.forEach((child, index) => {
    console.log(`  ${index}: ${child.type}`);
    if (child.type === 'switch_statement') {
        console.log('    Switch statement children:');
        child.children.forEach((subChild, subIndex) => {
            console.log(`      ${subIndex}: ${subChild.type}`);
            if (subChild.type === 'switch_body') {
                console.log('        Switch body children:');
                subChild.children.forEach((caseChild, caseIndex) => {
                    console.log(`          ${caseIndex}: ${caseChild.type}`);
                });
            }
        });
    }
});

// Test the configuration functions
const switchNode = rootNode.children.find(c => c && c.type === 'switch_statement');
if (switchNode) {
    console.log('\n=== Testing JavaScript Configuration ===');
    console.log('isConditional:', javascriptConfig.isConditional(switchNode));
    
    const condInfo = javascriptConfig.extractConditionInfo(switchNode);
    console.log('extractConditionInfo:', condInfo);
    
    const thenBranch = javascriptConfig.extractThenBranch(switchNode);
    console.log('extractThenBranch calls count:', thenBranch.calls.length);
    
    const elseBranch = javascriptConfig.extractElseBranch(switchNode);
    console.log('extractElseBranch calls count:', elseBranch.calls.length);
}