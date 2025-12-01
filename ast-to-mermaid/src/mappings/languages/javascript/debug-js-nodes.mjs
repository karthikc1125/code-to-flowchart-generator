import { extractJavaScript } from './src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';

const sourceCode = `
for (let i = 0; i < 3; i++) {
    console.log("For loop iteration: " + i);
}
`;

const ast = extractJavaScript(sourceCode);
console.log('AST:');
console.log(JSON.stringify(ast, null, 2));

const normalized = normalizeJavaScript(ast);
console.log('\nNormalized:');
console.log(JSON.stringify(normalized, null, 2));