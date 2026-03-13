import { createFlowBuilder } from './src/mappings/_common.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { javaConfig } from './src/mappings/java-config.mjs';
import { cppConfig } from './src/mappings/cpp-config.mjs';
import { normalizeTree } from './src/normalize.mjs';

import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import Java from 'tree-sitter-java';
import Cpp from 'tree-sitter-cpp';

const parsers = {
  javascript: new Parser(),
  java: new Parser(),
  cpp: new Parser()
};

parsers.javascript.setLanguage(JavaScript);
parsers.java.setLanguage(Java);
parsers.cpp.setLanguage(Cpp);

const testCases = [
  {
    name: "JavaScript for-in",
    lang: "javascript",
    code: `
const obj = {a: 1, b: 2};
for (const key in obj) {
  console.log(key);
}
    `,
    config: javascriptConfig
  },
  {
    name: "JavaScript for-of",
    lang: "javascript",
    code: `
const arr = [1, 2, 3];
for (const val of arr) {
  console.log(val);
}
    `,
    config: javascriptConfig
  },
  {
    name: "Java enhanced_for",
    lang: "java",
    code: `
class Test {
  public static void main(String[] args) {
    String[] arr = {"a", "b", "c"};
    for (String val : arr) {
      System.out.println(val);
    }
  }
}
    `,
    config: javaConfig
  },
  {
    name: "C++ for_range_loop",
    lang: "cpp",
    code: `
#include <iostream>
#include <vector>

int main() {
  std::vector<int> arr = {1, 2, 3};
  for (int val : arr) {
    std::cout << val << std::endl;
  }
  return 0;
}
    `,
    config: cppConfig
  }
];

function testForLoop(testCase) {
  console.log(`\nGenerating flowchart for ${testCase.name}...`);
  try {
    const tree = parsers[testCase.lang].parse(testCase.code);
    const normalizedTree = normalizeTree(tree);
    
    // For debugging, if something fails
    console.log("Normalized AST:");
    console.log(JSON.stringify(normalizedTree, null, 2));
    
    const flowchart = generateCommonFlowchart([normalizedTree], testCase.config);
    
    if (flowchart && flowchart.trim() !== '') {
      console.log("[OK] Generated flowchart.");
      console.log(flowchart);
    } else {
      console.log("[FAIL] Flowchart is empty.");
    }
  } catch (err) {
    console.error(`[ERROR] Failed to process ${testCase.name}:`, err.message);
  }
}

console.log("=== Testing Enhanced For Loops (for-in, for-of) ===");
for (const testCase of testCases) {
  testForLoop(testCase);
}
