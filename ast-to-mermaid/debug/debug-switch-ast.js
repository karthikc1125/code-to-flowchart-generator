import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { walkAst } from './src/walker.mjs';

const code = `
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
            break;
    }

    printf("End of program");
    return 0;
}
`;

async function debugAST() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('c');
    const tree = parser.parse(code);
    const normalized = normalizeTree(tree, languageModule);
    
    // Walk the AST and print node types and text
    for (const node of walkAst(normalized)) {
      if (node.type && (node.type.includes('switch') || node.type.includes('case') || node.type.includes('break'))) {
        console.log(`Type: ${node.type}, Text: "${node.text}"`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAST();

// Debug script to see the AST structure of a switch statement
import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { walkAst } from './src/walker.mjs';

const testCode = `
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
            break;
    }

    printf("End of program");
    return 0;
}
`;

async function debugAST() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('c');
    const tree = parser.parse(testCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Walk the AST and print node types and text
    for (const node of walkAst(normalized)) {
      if (node.type && (node.type.includes('switch') || node.type.includes('case') || node.type.includes('break'))) {
        console.log(`Type: ${node.type}, Text: "${node.text}"`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAST();

const ast = parseCode(code, 'c');
console.log(JSON.stringify(ast, null, 2));

// Test codes
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
}`;

const pyCode = `
x = 2
match x:
    case 1:
        print("One")
    case 2:
        print("Two")
    case _:
        print("Other")`;

const javaCode = `
public class Test {
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
    }
}`;

async function debugLanguage(code, language, name) {
  try {
    console.log(`\n=== ${name} Switch Statement AST ===`);
    const { parser, languageModule } = await loadParserForLanguage(language);
    const tree = parser.parse(code);
    const normalized = normalizeTree(tree, languageModule);
    
    for (const node of walkAst(normalized)) {
      if (node.type === 'switch_statement' || node.type === 'match_statement') {
        console.log(`Found ${node.type}:`);
        console.log('Text:', node.text);
        console.log('Children types:', node.children.map(c => c.type));
        
        // Look for cases
        for (const child of node.children) {
          if (child && (child.type === 'case_clause' || child.type === 'case_statement' || 
                       child.type === 'switch_case' || child.type === 'switch_block' ||
                       child.type === 'match_case' || child.type === 'pattern')) {
            console.log(`  Found case-like node: ${child.type}`);
            console.log('  Case text:', child.text);
            console.log('  Case children types:', child.children.map(c => c.type));
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error debugging ${name}:`, err.message);
  }
}

async function debug() {
  await debugLanguage(jsCode, 'js', 'JavaScript');
  await debugLanguage(pyCode, 'py', 'Python');
  await debugLanguage(javaCode, 'java', 'Java');
}

debug();