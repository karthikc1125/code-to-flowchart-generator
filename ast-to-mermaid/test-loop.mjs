import { generateMermaid } from './src/index.mjs';
import { readFileSync } from 'fs';

async function testLoop() {
  const code = readFileSync('tests/java/ForLoopTest.java', 'utf8');
  const result = await generateMermaid({ code, language: 'java' });
  console.log(result);
}

testLoop().catch(console.error);