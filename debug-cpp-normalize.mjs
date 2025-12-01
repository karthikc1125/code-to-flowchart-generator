import { extractCpp } from './ast-to-mermaid/src/mappings/languages/cpp/extractors/cpp-extractor.mjs';
import { normalizeCpp } from './ast-to-mermaid/src/mappings/languages/cpp/normalizer/normalize-cpp.mjs';

const sourceCode = `
#include <iostream>
using namespace std;

int checkNumber(int num) {
    if(num > 0)
        return 1;
    else if(num < 0)
        return -1;
    else
        return 0;
}

int main() {
    int n;
    cout << "Enter a number: ";
    cin >> n;
    return 0;
}
`;

console.log('Source code:');
console.log(sourceCode);

const ast = extractCpp(sourceCode);
console.log('\n=== RAW AST ===');
console.log(JSON.stringify(ast, null, 2));

const normalized = normalizeCpp(ast);
console.log('\n=== NORMALIZED AST ===');
console.log(JSON.stringify(normalized, null, 2));