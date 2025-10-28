import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const jsCode = fs.readFileSync('./tests/javascript/if_elif_else_test.js', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: jsCode, language: 'js' });
    console.log('JavaScript If/Else If/Else Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();