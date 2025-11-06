import { generateMermaid } from './src/index.mjs';

// Test with a more complex example including nested conditionals
const code = `
let a = 1;
if (a > 0) {
  console.log("positive");
  if (a > 5) {
    console.log("greater than 5");
  } else {
    console.log("less than or equal to 5");
  }
} else if (a < 0) {
  console.log("negative");
} else {
  console.log("zero");
}
let b = 2;
console.log("done");
`;

generateMermaid({ code, language: 'js' }).then(result => {
  console.log(result);
});