import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

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

async function debug() {
  try {
    console.log('=== JavaScript Switch Statement Detailed AST ===');
    const { parser, languageModule } = await loadParserForLanguage('js');
    const tree = parser.parse(jsCode);
    const normalized = normalizeTree(tree, languageModule);
    
    for (const node of walkAst(normalized)) {
      if (node.type === 'switch_statement') {
        console.log(`Found ${node.type}:`);
        console.log('Text:', node.text);
        console.log('Children types:', node.children.map(c => c.type));
        
        // Look at switch_body
        const switchBody = node.children.find(c => c && c.type === 'switch_body');
        if (switchBody) {
          console.log('\nSwitch body:');
          console.log('Text:', switchBody.text);
          console.log('Children types:', switchBody.children.map(c => c.type));
          
          // Look at case clauses
          for (const child of switchBody.children) {
            if (child && child.type === 'switch_case') {
              console.log(`\n  Case clause:`);
              console.log('  Text:', child.text);
              console.log('  Children types:', child.children.map(c => c.type));
              
              // Look for statements in the case
              for (const stmt of child.children) {
                if (stmt && stmt.type === 'statement_block') {
                  console.log('    Statement block:');
                  console.log('    Text:', stmt.text);
                  console.log('    Children types:', stmt.children.map(c => c.type));
                }
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