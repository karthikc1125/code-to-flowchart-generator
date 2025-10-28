import { loadParserForLanguage } from './src/parser.mjs';

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
  
  if (node.type === 'variable_declarator') {
    console.log(`${spaces}  *** THIS IS A VARIABLE DECLARATOR ***`);
  }
  
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
    const { parser } = await loadParserForLanguage('java');
    const tree = parser.parse(javaCode);
    console.log('Java AST (focusing on the assignment):');
    printNode(tree.rootNode);
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();