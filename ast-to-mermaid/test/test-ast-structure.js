import Parser from 'tree-sitter';
import C from 'tree-sitter-c';
import Java from 'tree-sitter-java';
import CPP from 'tree-sitter-cpp';

// Test C switch statement
const cCode = `
#include <stdio.h>
int main() {
    int x = 2;
    switch (x) {
        case 1:
            printf("One");
            break;
        case 2:
            printf("Two");
            break;
        default:
            printf("Other");
    }
    printf("End of program");
    return 0;
}`;

// Test Java switch statement
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

// Test C++ switch statement
const cppCode = `
#include <iostream>
using namespace std;
int main() {
    int x = 2;
    switch (x) {
        case 1:
            cout << "One";
            break;
        case 2:
            cout << "Two";
            break;
        default:
            cout << "Other";
    }
    cout << "End of program";
    return 0;
}
`;

function printAST(code, language, parser) {
    try {
        const tree = parser.parse(code);
        console.log(`${language} AST Root Type:`, tree.rootNode.type);
        console.log(`${language} AST Structure:`);
        printNode(tree.rootNode, 0);
    } catch (error) {
        console.error(`Error parsing ${language}:`, error.message);
    }
}

function printNode(node, depth) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type}: "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"`);
    
    if (node.type === 'switch_statement' || node.type.includes('switch') || node.type.includes('case')) {
        console.log(`${indent}>>> FOUND SWITCH/CASE NODE <<<`);
    }
    
    if (depth < 3) { // Limit depth for readability
        for (const child of node.children || []) {
            if (child) {
                printNode(child, depth + 1);
            }
        }
    }
}

// Create parsers
const cParser = new Parser();
cParser.setLanguage(C);

const javaParser = new Parser();
javaParser.setLanguage(Java);

const cppParser = new Parser();
cppParser.setLanguage(CPP);

console.log('=== C SWITCH STATEMENT ===');
printAST(cCode, 'C', cParser);

console.log('\n=== JAVA SWITCH STATEMENT ===');
printAST(javaCode, 'Java', javaParser);

console.log('\n=== C++ SWITCH STATEMENT ===');
printAST(cppCode, 'C++', cppParser);