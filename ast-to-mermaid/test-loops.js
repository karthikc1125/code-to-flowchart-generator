import { generateMermaid } from './src/index.mjs';

// Test with loops to make sure we didn't break anything
const code = `
let i = 0;
while (i < 10) {
  console.log(i);
  i = i + 1;
}
console.log("done");
`;

generateMermaid({ code, language: 'js' }).then(result => {
  console.log(result);
});