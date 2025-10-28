import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { javaConfig } from './src/mappings/java-config.mjs';
import { generateCommonFlowchart } from './debug-common-flowchart.js';
import fs from 'fs';

const javaCode = fs.readFileSync('./tests/java/IfElifElseTest.java', 'utf8');

async function test() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('java');
    const tree = parser.parse(javaCode);
    const normalized = normalizeTree(tree, languageModule);
    const result = generateCommonFlowchart(walkAst(normalized), javaConfig);
    console.log('Java If/Else If/Else Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();