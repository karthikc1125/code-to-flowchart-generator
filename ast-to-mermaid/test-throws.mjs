import { createFlowBuilder } from './src/mappings/_common.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { cppConfig } from './src/mappings/cpp-config.mjs';
import { normalizeTree } from './src/normalize.mjs';

import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import Cpp from 'tree-sitter-cpp';

function testLanguage(name, langData, config, code) {
  console.log("=== " + name + " ===");
  try {
    const parser = new Parser();
    parser.setLanguage(langData);
    const tree = parser.parse(code);
    const normalized = normalizeTree(tree);
    const flowchart = generateCommonFlowchart([normalized], config);
    console.log(flowchart);
    console.log('\\n');
  } catch(e) {
    console.error("Failed to parse " + name, e);
  }
}

testLanguage('C++', Cpp, cppConfig, `
int main() {
    try {
        int a = 10;
        int b = 0;
        if (b == 0) {
           throw "error";
        }
        cout << a / b;
    } catch (const char* msg) {
        cout << msg;
    }
    return 0;
}
`);

testLanguage('JavaScript', JavaScript, javascriptConfig, `
try {
  let a = 10;
  let b = 0;
  if (b === 0) {
      throw new Error("Div by 0");
  }
  console.log(a / b);
} catch (e) {
  console.log(e);
}
`);
