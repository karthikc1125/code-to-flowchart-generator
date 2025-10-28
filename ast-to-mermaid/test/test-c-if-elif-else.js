import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const cCode = fs.readFileSync('./tests/c/if_elif_else_test.c', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: cCode, language: 'c' });
    console.log('C If/Else If/Else Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();