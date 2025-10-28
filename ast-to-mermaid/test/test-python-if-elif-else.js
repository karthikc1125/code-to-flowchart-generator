import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/if_elif_else_test.py', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: pyCode, language: 'py' });
    console.log('Python If/Elif/Else Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();