import { generateMermaid } from './src/index.mjs';

const pyCode = `
if x > 0:
    print("Positive number")
elif x < 0:
    print("Negative number")
else:
    print("Zero")
`;

async function test() {
  try {
    const result = await generateMermaid({ code: pyCode, language: 'py' });
    console.log('Simple If/Elif/Else Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();