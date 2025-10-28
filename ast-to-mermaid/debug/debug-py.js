import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { walkAst } from './src/walker.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';

const pyCode = `name = input("What is your name? ")
print("Hello, " + name)`;

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
    const { parser, languageModule } = await loadParserForLanguage('python');
    const tree = parser.parse(pyCode);
    const normalized = normalizeTree(tree, languageModule);
    
    console.log('Walking AST nodes:');
    for (const node of walkAst(normalized)) {
      console.log(`Node type: ${node.type}`);
      console.log(`  Text: ${node.text?.substring(0, 50)}`);
      
      // Check if this node is detected as an input call
      if (pythonConfig.isInputCall(node)) {
        console.log(`  *** DETECTED AS INPUT CALL ***`);
        const inputInfo = pythonConfig.extractInputInfo(node);
        console.log(`  Input info:`, inputInfo);
      }
      
      // Check if this node is detected as an output call
      if (pythonConfig.isOutputCall && pythonConfig.isOutputCall(node)) {
        console.log(`  *** DETECTED AS OUTPUT CALL ***`);
        const outputInfo = pythonConfig.extractOutputInfo(node);
        console.log(`  Output info:`, outputInfo);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();