import { generateMermaid } from './src/index.mjs';

const testCode = `x = 2
print("Hello")
`;

async function debug() {
  try {
    const result = await generateMermaid({ code: testCode, language: 'python' });
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

debug();