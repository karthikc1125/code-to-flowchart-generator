import { generateMermaid } from './src/index.mjs';

const pyCode = `name = input("What is your name? ")
print("Hello, " + name)`;

async function test() {
  try {
    const result = await generateMermaid({ code: pyCode, language: 'py' });
    console.log('Python Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();