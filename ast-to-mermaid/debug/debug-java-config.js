import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { walkAst } from './src/walker.mjs';
import { javaConfig } from './src/mappings/java-config.mjs';

const javaCode = `import java.util.Scanner;

public class InputPrint {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        scanner.close();
    }
}`;

function printNode(node, indent = 0) {
  const spaces = '  '.repeat(indent);
  console.log(`${spaces}${node.type}: ${node.text?.substring(0, 50)}`);
  
  if (node.children) {
    for (const child of node.children) {
      if (child) {
        printNode(child, indent + 1);
      }
    }
  }
}

async function debug() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('java');
    const tree = parser.parse(javaCode);
    const normalized = normalizeTree(tree, languageModule);
    
    console.log('Walking AST nodes:');
    for (const node of walkAst(normalized)) {
      console.log(`Node type: ${node.type}`);
      console.log(`  Text: ${node.text?.substring(0, 50)}`);
      
      // For method_invocation nodes, show the callee name
      if (node.type === 'method_invocation') {
        const callee = node.children.find(c => c && (c.type === 'identifier' || c.type === 'field_access'));
        console.log(`  Callee: ${callee?.text}`);
      }
      
      // Check if this node is detected as an input call
      if (javaConfig.isInputCall(node)) {
        console.log(`  *** DETECTED AS INPUT CALL ***`);
        const inputInfo = javaConfig.extractInputInfo(node);
        console.log(`  Input info:`, inputInfo);
      }
      
      // Check if this node is detected as an output call
      if (javaConfig.isOutputCall && javaConfig.isOutputCall(node)) {
        console.log(`  *** DETECTED AS OUTPUT CALL ***`);
        const outputInfo = javaConfig.extractOutputInfo(node);
        console.log(`  Output info:`, outputInfo);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();