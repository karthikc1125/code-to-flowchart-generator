import fs from 'fs';
import { extractJavaScript } from './src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';

const sourceCode = `
for (let i = 0; i < 3; i++) {
    console.log("For loop iteration: " + i);
}
`;

const ast = extractJavaScript(sourceCode);
const normalized = normalizeJavaScript(ast);

console.log('Normalized AST:');
console.log(JSON.stringify(normalized, null, 2));

// Find the for loop and inspect its body
function findForLoop(node) {
  if (!node) return null;
  
  if (node.type === 'For') {
    return node;
  }
  
  if (Array.isArray(node)) {
    for (const child of node) {
      const result = findForLoop(child);
      if (result) return result;
    }
  } else if (typeof node === 'object') {
    for (const key in node) {
      if (typeof node[key] === 'object') {
        const result = findForLoop(node[key]);
        if (result) return result;
      }
    }
  }
  
  return null;
}

const forLoop = findForLoop(normalized);
if (forLoop) {
  console.log('\nFor loop body:');
  console.log(JSON.stringify(forLoop.body, null, 2));
}