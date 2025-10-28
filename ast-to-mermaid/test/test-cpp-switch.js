import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const cppCode = fs.readFileSync('./tests/cpp/switch_test.cpp', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: cppCode, language: 'cpp' });
    console.log('C++ Switch Statement Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();