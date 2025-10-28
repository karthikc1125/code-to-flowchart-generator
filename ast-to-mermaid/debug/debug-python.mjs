import { parseCode } from './src/parser.mjs';

// Test Python AST structure
const code = `name = input("What is your name? ")`;
console.log('Parsing Python code:', code);

try {
  const ast = parseCode(code, 'py');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.error('Error parsing code:', error);
}