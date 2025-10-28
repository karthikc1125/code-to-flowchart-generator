import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

const pyCode = `
x = 2
match x:
    case 1:
        print("One")
    case 2:
        print("Two")
    case _:
        print("Other")`;

async function debug() {
  try {
    console.log('=== Python Match Statement Detailed AST ===');
    const { parser, languageModule } = await loadParserForLanguage('py');
    const tree = parser.parse(pyCode);
    const normalized = normalizeTree(tree, languageModule);
    
    for (const node of walkAst(normalized)) {
      if (node.type === 'match_statement') {
        console.log(`Found ${node.type}:`);
        console.log('Text:', node.text);
        console.log('Children types:', node.children.map(c => c.type));
        
        // Look at block
        const block = node.children.find(c => c && c.type === 'block');
        if (block) {
          console.log('\nBlock:');
          console.log('Text:', block.text);
          console.log('Children types:', block.children.map(c => c.type));
          
          // Look at case clauses
          for (const child of block.children) {
            if (child && child.type === 'case_clause') {
              console.log(`\n  Case clause:`);
              console.log('  Text:', child.text);
              console.log('  Children types:', child.children.map(c => c.type));
              
              // Look for statements in the case
              const caseBlock = child.children.find(c => c && c.type === 'block');
              if (caseBlock) {
                console.log('    Case block:');
                console.log('    Text:', caseBlock.text);
                console.log('    Children types:', caseBlock.children.map(c => c.type));
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

debug();