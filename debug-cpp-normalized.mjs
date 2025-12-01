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
const normalized = normalizeCpp(ast);

console.log('\n=== NORMALIZED STRUCTURE ===');
function printNode(node, indent = 0) {
  const spaces = '  '.repeat(indent);
  if (!node) {
    console.log(`${spaces}null`);
    return;
  }
  
  if (Array.isArray(node)) {
    console.log(`${spaces}[`);
    node.forEach((item, index) => {
      console.log(`${spaces}  [${index}]:`);
      printNode(item, indent + 2);
    });
    console.log(`${spaces}]`);
    return;
  }
  
  console.log(`${spaces}{`);
  console.log(`${spaces}  type: ${node.type}`);
  console.log(`${spaces}  name: ${node.name}`);
  if (node.body) {
    console.log(`${spaces}  body:`);
    if (Array.isArray(node.body)) {
      node.body.forEach((item, index) => {
        console.log(`${spaces}    [${index}]:`);
        printNode(item, indent + 3);
      });
    } else {
      printNode(node.body, indent + 2);
    }
  }
  if (node.allFunctions) {
    console.log(`${spaces}  allFunctions:`);
    node.allFunctions.forEach((item, index) => {
      console.log(`${spaces}    [${index}]:`);
      printNode(item, indent + 3);
    });
  }
  console.log(`${spaces}}`);
}

printNode(normalized);