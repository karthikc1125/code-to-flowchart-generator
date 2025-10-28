import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const pyCode = fs.readFileSync('./tests/python/input_assignment_test.py', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: pyCode, language: 'py' });
    console.log('Python Input Assignment Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();