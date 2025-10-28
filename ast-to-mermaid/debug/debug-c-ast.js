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
    console.log('C AST for if/else if/else:');
    for (const node of walkAst(normalized)) {
      if (node.type === 'if_statement') {
        console.log('Found if_statement node:');
        console.log(JSON.stringify(node, null, 2));
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();