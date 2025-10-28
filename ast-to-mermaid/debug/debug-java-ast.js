import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

const javaCode = fs.readFileSync('./tests/java/if_elif_else_test.java', 'utf8');

async function debug() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('java');
    const tree = parser.parse(javaCode);
    console.log('Raw tree:', tree.rootNode.toString());
    const normalized = normalizeTree(tree, languageModule);
    console.log('Normalized tree:', JSON.stringify(normalized, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();