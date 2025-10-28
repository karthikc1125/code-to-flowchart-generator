import { generateMermaid } from './src/index.mjs';
import fs from 'fs';

const javaCode = fs.readFileSync('./tests/java/IfElifElseTest.java', 'utf8');

async function test() {
  try {
    const result = await generateMermaid({ code: javaCode, language: 'java' });
    console.log('Java If/Else If/Else Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();