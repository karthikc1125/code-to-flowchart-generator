// Test Python match statement processing
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

console.log('Python AST Root Type:', rootNode.type);
console.log('Python AST Children Types:');
rootNode.children.forEach((child, index) => {
    console.log(`  ${index}: ${child.type}`);
    if (child.type === 'match_statement') {
        console.log('    Match statement children:');
        child.children.forEach((subChild, subIndex) => {
            console.log(`      ${subIndex}: ${subChild.type}`);
            if (subChild.type === 'block') {
                console.log('        Block children:');
                subChild.children.forEach((caseChild, caseIndex) => {
                    console.log(`          ${caseIndex}: ${caseChild.type}`);
                    if (caseChild.type === 'case_clause') {
                        console.log('            Case clause children:');
                        caseChild.children.forEach((clauseChild, clauseIndex) => {
                            console.log(`              ${clauseIndex}: ${clauseChild.type}`);
                            if (clauseChild.type === 'block') {
                                console.log('                Block children:');
                                clauseChild.children.forEach((blockChild, blockIndex) => {
                                    console.log(`                  ${blockIndex}: ${blockChild.type}`);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

// Test the configuration functions
const matchNode = rootNode.children.find(c => c && c.type === 'match_statement');
if (matchNode) {
    console.log('\n=== Testing Python Configuration ===');
    console.log('isConditional:', pythonConfig.isConditional(matchNode));
    
    const condInfo = pythonConfig.extractConditionInfo(matchNode);
    console.log('extractConditionInfo:', condInfo);
    
    const thenBranch = pythonConfig.extractThenBranch(matchNode);
    console.log('extractThenBranch calls count:', thenBranch.calls.length);
    thenBranch.calls.forEach((call, index) => {
        console.log(`  Call ${index}: ${call.type}`);
    });
    
    const elseBranch = pythonConfig.extractElseBranch(matchNode);
    console.log('extractElseBranch calls count:', elseBranch.calls.length);
}