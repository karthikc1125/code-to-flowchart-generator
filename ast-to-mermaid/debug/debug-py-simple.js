import { generateMermaid } from './src/index.mjs';

const testCode = `x = 2

match x:
    case 1:
        print("One")
    case 2:
        print("Two")
    case _:
        print("Other")

print("End of program")
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