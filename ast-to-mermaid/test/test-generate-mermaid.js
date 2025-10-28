// Test JavaScript switch statement with generateMermaid function
import { generateMermaid } from './src/index.mjs';

const jsCode = `
let x = 2;
switch (x) {
    case 1:
        console.log("One");
        break;
    case 2:
        console.log("Two");
        break;
    default:
        console.log("Other");
}
console.log("End of program");
`;

async function test() {
    try {
        const result = await generateMermaid({ code: jsCode, language: 'js' });
        console.log('JavaScript Switch Statement Mermaid Output:');
        console.log(result);
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
    }
}

test();