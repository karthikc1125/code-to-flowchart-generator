// Debug script to see the AST structure of a Python match statement
import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';

const testCode = `
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

async function debugAST() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('python');
    const tree = parser.parse(testCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Simple function to walk and print the AST
    function walk(node, depth = 0) {
      if (!node) return;
      const indent = '  '.repeat(depth);
      console.log(`${indent}${node.type}: "${node.text?.substring(0, 50)}${node.text?.length > 50 ? '...' : ''}"`);
      
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          if (child) {
            walk(child, depth + 1);
          }
        }
      }
    }
    
    walk(normalized);
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAST();