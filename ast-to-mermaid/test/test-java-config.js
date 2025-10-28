// Test Java switch statement processing
import { javaConfig } from './src/mappings/java-config.mjs';
import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

const javaCode = `
public class SwitchTest {
    public static void main(String[] args) {
        int x = 2;
        switch (x) {
            case 1:
                System.out.println("One");
                break;
            case 2:
                System.out.println("Two");
                break;
            default:
                System.out.println("Other");
        }
        System.out.println("End of program");
    }
}
`;

// Parse the code
const parser = new Parser();
parser.setLanguage(Java);
const tree = parser.parse(javaCode);
const rootNode = tree.rootNode;

console.log('Java AST Root Type:', rootNode.type);
console.log('Java AST Children Types:');
rootNode.children.forEach((child, index) => {
    console.log(`  ${index}: ${child.type}`);
    if (child.type === 'class_declaration') {
        console.log('    Class declaration children:');
        child.children.forEach((subChild, subIndex) => {
            console.log(`      ${subIndex}: ${subChild.type}`);
            if (subChild.type === 'class_body') {
                console.log('        Class body children:');
                subChild.children.forEach((classChild, classIndex) => {
                    console.log(`          ${classIndex}: ${classChild.type}`);
                    if (classChild.type === 'method_declaration') {
                        console.log('            Method declaration children:');
                        classChild.children.forEach((methodChild, methodIndex) => {
                            console.log(`              ${methodIndex}: ${methodChild.type}`);
                            if (methodChild.type === 'block') {
                                console.log('                Block children:');
                                methodChild.children.forEach((blockChild, blockIndex) => {
                                    console.log(`                  ${blockIndex}: ${blockChild.type}`);
                                    if (blockChild.type === 'switch_expression') {
                                        console.log('                    Switch expression children:');
                                        blockChild.children.forEach((switchChild, switchIndex) => {
                                            console.log(`                      ${switchIndex}: ${switchChild.type}`);
                                            if (switchChild.type === 'switch_block') {
                                                console.log('                        Switch block children:');
                                                switchChild.children.forEach((blockChild, blockIndex) => {
                                                    console.log(`                          ${blockIndex}: ${blockChild.type}`);
                                                    if (blockChild.type === 'switch_block_statement_group') {
                                                        console.log('                            Switch block statement group children:');
                                                        blockChild.children.forEach((groupChild, groupIndex) => {
                                                            console.log(`                              ${groupIndex}: ${groupChild.type}`);
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
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
const classes = [];
function findAllClasses(node) {
    if (node) {
        if (node.type === 'class_declaration') {
            classes.push(node);
        }
        for (const child of node.children || []) {
            findAllClasses(child);
        }
    }
}
findAllClasses(rootNode);

if (classes.length > 0) {
    const classNode = classes[0];
    const body = (classNode.children || []).find(c => c && c.type === 'class_body');
    if (body) {
        const methods = [];
        function findAllMethods(node) {
            if (node) {
                if (node.type === 'method_declaration') {
                    methods.push(node);
                }
                for (const child of node.children || []) {
                    findAllMethods(child);
                }
            }
        }
        findAllMethods(body);
        
        const main = methods.find(m => /\bmain\b/.test(m.text));
        if (main) {
            const block = (main.children || []).find(c => c && (c.type === 'block'));
            if (block) {
                const switchNodes = [];
                function findAllSwitches(node) {
                    if (node) {
                        if (node.type === 'switch_expression') {
                            switchNodes.push(node);
                        }
                        for (const child of node.children || []) {
                            findAllSwitches(child);
                        }
                    }
                }
                findAllSwitches(block);
                
                if (switchNodes.length > 0) {
                    const switchNode = switchNodes[0];
                    console.log('\n=== Testing Java Configuration ===');
                    console.log('isConditional:', javaConfig.isConditional(switchNode));
                    
                    const condInfo = javaConfig.extractConditionInfo(switchNode);
                    console.log('extractConditionInfo:', condInfo);
                    
                    const thenBranch = javaConfig.extractThenBranch(switchNode);
                    console.log('extractThenBranch calls count:', thenBranch.calls.length);
                    thenBranch.calls.forEach((call, index) => {
                        console.log(`  Call ${index}: ${call.type}`);
                    });
                    
                    const elseBranch = javaConfig.extractElseBranch(switchNode);
                    console.log('extractElseBranch calls count:', elseBranch.calls.length);
                }
            }
        }
    }
}