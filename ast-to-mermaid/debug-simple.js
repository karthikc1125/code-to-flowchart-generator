import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadParserForLanguage } from './src/parser.mjs';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printNode(node, indent = 0) {
  const spacing = '  '.repeat(indent);
  console.log(`${spacing}${node.type}: ${node.text?.substring(0, 50)}${node.text?.length > 50 ? '...' : ''}`);
  
  if (node.children) {
    for (const child of node.children) {
      printNode(child, indent + 1);
    }
  }
}

async function debugConditional() {
  console.log('Debugging conditional chain AST structure...\n');
  
  // JavaScript conditional program
  const jsCode = fs.readFileSync(path.join(__dirname, 'tests', 'js', 'if else if statements', 'simple-test.js'), 'utf8');
  console.log('JavaScript Conditional Program:');
  console.log(jsCode);
  
  try {
    const { parser } = await loadParserForLanguage('js');
    const tree = parser.parse(jsCode);
    console.log('\nAST Structure:');
    printNode(tree.rootNode);
  } catch (error) {
    console.error('Error parsing AST:', error.message);
  }
}

// Run the debug
debugConditional().catch(console.error);