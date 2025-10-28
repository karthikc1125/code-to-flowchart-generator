import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { javaConfig } from './src/mappings/java-config.mjs';
import fs from 'fs';

const javaCode = fs.readFileSync('./tests/java/IfElifElseTest.java', 'utf8');

async function debug() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('java');
    const tree = parser.parse(javaCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Find all if statements
    const ifStatements = [];
    for (const node of walkAst(normalized)) {
      if (node.type === 'if_statement') {
        ifStatements.push(node);
      }
    }
    
    console.log(`Found ${ifStatements.length} if statements`);
    
    for (let i = 0; i < ifStatements.length; i++) {
      const ifStmt = ifStatements[i];
      console.log(`\nIf Statement ${i + 1}:`);
      console.log('Text:', ifStmt.text);
      console.log('Children types:', ifStmt.children.map(c => c.type));
      
      // Try to extract else branch using Java config
      const elseInfo = javaConfig.extractElseBranch(ifStmt);
      console.log('Else branch calls:', elseInfo.calls.length);
      
      // Manual extraction for Java-style else
      const elseIndex = ifStmt.children ? ifStmt.children.findIndex(c => c && c.type === 'else') : -1;
      if (elseIndex !== -1) {
        console.log('Found else keyword at index:', elseIndex);
        if (elseIndex + 1 < ifStmt.children.length) {
          const blockNode = ifStmt.children[elseIndex + 1];
          console.log('Block node type:', blockNode.type);
          if (blockNode && (blockNode.type === 'block' || blockNode.type === 'compound_statement')) {
            console.log('Found block after else');
            // Try to find method invocations in the block
            const calls = [];
            function findAllCalls(node) {
              if (!node) return;
              if (node.type === 'method_invocation') {
                calls.push(node);
              }
              for (const child of node.children || []) {
                findAllCalls(child);
              }
            }
            findAllCalls(blockNode);
            console.log('Found', calls.length, 'method invocations in else block');
            for (const call of calls) {
              console.log('  Call:', call.text);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();