import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const jsCode = fs.readFileSync('./tests/javascript/switch_test.js', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: jsCode, language: 'javascript' });
    console.log('JavaScript Switch Statement Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();