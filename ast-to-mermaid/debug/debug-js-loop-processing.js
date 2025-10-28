import { generateMermaid } from './src/index.mjs';

const testCode = `
for (let i = 0; i < 10; i++) {
    console.log("Iteration: " + i);
}

console.log("Loop finished");
`;

async function debug() {
  try {
    const result = await generateMermaid({ code: testCode, language: 'javascript' });
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

debug();