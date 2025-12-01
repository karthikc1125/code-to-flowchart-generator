import { extractC } from './ast-to-mermaid/src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './ast-to-mermaid/src/mappings/languages/c/normalizer/normalize-c.mjs';

const sourceCode = `if(checkNumber(n) == 1) { }`;

console.log('Source code:');
console.log(sourceCode);

const ast = extractC(sourceCode);
console.log('\n=== RAW AST ===');

// Find binary expressions
function findBinaryExpressions(node, depth = 0) {
  if (!node) return;
  
  const indent = '  '.repeat(depth);
  
  if (node.type === 'binary_expression') {
    console.log(`${indent}Found binary_expression:`);
    console.log(`${indent}Text: ${node.text}`);
    console.log(`${indent}Children count: ${node.children ? node.children.length : 0}`);
    if (node.children) {
      node.children.forEach((child, index) => {
        console.log(`${indent}  Child ${index}: ${child.type}`);
        console.log(`${indent}    Text: ${child.text}`);
      });
    }
  }
  
  if (node.children) {
    node.children.forEach(child => findBinaryExpressions(child, depth + 1));
  }
}

findBinaryExpressions(ast);

console.log('\n=== NORMALIZED ===');
const normalized = normalizeC(ast);
console.log(JSON.stringify(normalized, null, 2));