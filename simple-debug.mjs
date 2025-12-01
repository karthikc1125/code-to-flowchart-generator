import { extractC } from './ast-to-mermaid/src/mappings/languages/c/extractors/c-extractor.mjs';

const sourceCode = `scanf("%d", &n);`;

console.log('Source code:');
console.log(sourceCode);

const ast = extractC(sourceCode);
console.log('\n=== RAW AST ===');

// Find call_expression nodes
function findCallExpressions(node) {
  if (!node) return;
  
  if (node.type === 'call_expression') {
    console.log('Found call_expression:');
    console.log('Text:', node.text);
    console.log('Children count:', node.children ? node.children.length : 0);
    if (node.children) {
      node.children.forEach((child, index) => {
        console.log(`  Child ${index}: ${child.type}`);
        console.log(`    Text: ${child.text}`);
      });
    }
  }
  
  if (node.children) {
    node.children.forEach(child => findCallExpressions(child));
  }
}

findCallExpressions(ast);