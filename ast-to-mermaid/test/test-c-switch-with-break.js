import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const cCode = fs.readFileSync('./tests/c/switch_test_with_break.c', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: cCode, language: 'c' });
    console.log('C Switch Statement With Break Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();