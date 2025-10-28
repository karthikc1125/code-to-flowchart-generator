import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/switch_test.py', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: pyCode, language: 'python' });
    console.log('Python Match Statement Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();