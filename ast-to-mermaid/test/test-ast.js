import { parseCode } from './src/parse.mjs';

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

function printAST(code, language) {
    try {
        const ast = parseCode(code, language);
        console.log(`${language} AST:`);
        console.log(JSON.stringify(ast, null, 2));
    } catch (error) {
        console.error(`Error parsing ${language}:`, error.message);
    }
}

printAST(cCode, 'c');
printAST(javaCode, 'java');
printAST(cppCode, 'cpp');