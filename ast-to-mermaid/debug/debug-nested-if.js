import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

const cCode = fs.readFileSync('./tests/c/if_elif_else_test.c', 'utf8');

async function debug() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('c');
    const tree = parser.parse(cCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Walk the AST and find all if_statement nodes
    const ifStatements = [];
    for (const node of walkAst(normalized)) {
      if (node.type === 'if_statement') {
        ifStatements.push(node);
      }
    }
    
    console.log(`Found ${ifStatements.length} if_statement nodes:`);
    for (let i = 0; i < ifStatements.length; i++) {
      console.log(`\nIf Statement ${i + 1}:`);
      console.log('Text:', ifStatements[i].text);
      console.log('Children types:', ifStatements[i].children.map(c => c.type));
      
      // Look for else_clause
      const elseClause = ifStatements[i].children.find(c => c && c.type === 'else_clause');
      if (elseClause) {
        console.log('Found else_clause:');
        console.log('Else clause text:', elseClause.text);
        console.log('Else clause children types:', elseClause.children.map(c => c.type));
        
        // Look for compound_statement in else_clause
        const compoundStatement = elseClause.children.find(c => c && (c.type === 'compound_statement' || c.type === 'block'));
        if (compoundStatement) {
          console.log('Found compound_statement in else_clause:');
          console.log('Compound statement text:', compoundStatement.text);
          console.log('Compound statement children types:', compoundStatement.children.map(c => c.type));
          
          // Look for if_statement in compound_statement
          const nestedIf = compoundStatement.children.find(c => c && c.type === 'if_statement');
          if (nestedIf) {
            console.log('Found nested if_statement in compound_statement:');
            console.log('Nested if text:', nestedIf.text);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();