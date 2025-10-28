import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

const cppCode = fs.readFileSync('./tests/cpp/if_elif_else_test.cpp', 'utf8');

async function debug() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('cpp');
    const tree = parser.parse(cppCode);
    const normalized = normalizeTree(tree, languageModule);
    console.log('C++ AST for if/else if/else:');
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