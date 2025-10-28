// Debug script to see the AST structure of a Java switch statement
import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';

const testCode = `
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
                break;
        }

        System.out.println("End of program");
    }
}
`;

async function debugAST() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('java');
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