import { javaConfig } from './src/mappings/java-config.mjs';
import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

// Test nested conditional
const sourceCode = `
public class NestedConditionalTest {
    public static void main(String[] args) {
        int x = 5;
        int y = 10;
        
        if (x > 0) {
            if (y > 5) {
                System.out.println("Both positive");
            } else {
                System.out.println("X positive, Y not greater than 5");
            }
        } else if (x == 0) {
            System.out.println("X is zero");
        } else {
            System.out.println("X is negative");
        }
        
        System.out.println("End of program");
    }
}
`;

const parser = new Parser();
parser.setLanguage(Java);

const tree = parser.parse(sourceCode);

// Find the main method
function findMainMethod(node) {
  if (!node) return null;
  if (node.type === 'method_declaration' && node.text.includes('main')) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const result = findMainMethod(child);
      if (result) return result;
    }
  }
  return null;
}

const mainMethod = findMainMethod(tree.rootNode);
console.log('Main method found:', !!mainMethod);

if (mainMethod) {
  const block = mainMethod.children.find(c => c && c.type === 'block');
  console.log('Block found:', !!block);
  
  if (block && block.children) {
    console.log('Statements in main method:');
    for (const stmt of block.children) {
      if (stmt && stmt.type !== '{' && stmt.type !== '}') {
        console.log(`  ${stmt.type}: "${stmt.text.substring(0, 50)}..."`);
        
        // Check if it's a conditional
        if (javaConfig.isConditional(stmt)) {
          console.log('    -> This is a conditional statement');
          const condInfo = javaConfig.extractConditionInfo(stmt);
          console.log('    -> Condition:', condInfo.text);
          
          const thenBranch = javaConfig.extractThenBranch(stmt);
          console.log('    -> Then branch has', thenBranch.calls.length, 'statements');
          for (const call of thenBranch.calls) {
            console.log('      ->', call.type, ':', call.text.substring(0, 30));
          }
          
          const elseBranch = javaConfig.extractElseBranch(stmt);
          console.log('    -> Else branch has', elseBranch.calls.length, 'statements');
          for (const call of elseBranch.calls) {
            console.log('      ->', call.type, ':', call.text.substring(0, 30));
          }
        }
      }
    }
  }
}