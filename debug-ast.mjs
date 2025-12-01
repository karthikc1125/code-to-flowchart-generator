import { extractC } from './ast-to-mermaid/src/mappings/languages/c/extractors/c-extractor.mjs';

const sourceCode = `
int main() {
    int n;
    scanf("%d", &n);
    return 0;
}
`;

console.log('Source code:');
console.log(sourceCode);

const ast = extractC(sourceCode);
console.log('\n=== RAW AST ===');
console.log(JSON.stringify(ast, null, 2));