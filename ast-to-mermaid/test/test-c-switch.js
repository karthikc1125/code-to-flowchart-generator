import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const cCode = fs.readFileSync('./tests/c/switch_test.c', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: cCode, language: 'c' });
    console.log('C Switch Statement Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();