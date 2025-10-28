// Test switch statements using the API directly
import http from 'http';

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

// Test JavaScript switch statement
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
        break;
}
console.log("End of program");
`;

// Test Python match statement
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

function testLanguage(code, language, name) {
    const data = JSON.stringify({
        code: code,
        language: language
    });

    const options = {
        hostname: 'localhost',
        port: 3400,
        path: '/convert',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let result = '';
        res.on('data', (chunk) => {
            result += chunk;
        });
        res.on('end', () => {
            console.log(`${name} Switch Statement Mermaid Output:`);
            console.log(result);
            console.log('---');
        });
    });

    req.on('error', (error) => {
        console.error(`Error testing ${name}:`, error.message);
    });

    req.write(data);
    req.end();
}

// Test all languages
console.log('Testing switch statements across all languages...\n');

// Since we're in the same process, let's test one at a time
setTimeout(() => testLanguage(cCode, 'c', 'C'), 100);
setTimeout(() => testLanguage(jsCode, 'js', 'JavaScript'), 200);
setTimeout(() => testLanguage(pyCode, 'py', 'Python'), 300);
setTimeout(() => testLanguage(javaCode, 'java', 'Java'), 400);
setTimeout(() => testLanguage(cppCode, 'cpp', 'C++'), 500);