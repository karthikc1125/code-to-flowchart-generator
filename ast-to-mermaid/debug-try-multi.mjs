import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';
import Java from 'tree-sitter-java';
import Cpp from 'tree-sitter-cpp';
import { normalizeTree } from './src/normalize.mjs';

function debugAst(Language, code, name) {
  console.log("=== " + name + " ===");
  const parser = new Parser();
  parser.setLanguage(Language);
  
  const tree = parser.parse(code);
  const normalized = normalizeTree(tree);
  
  // Recursively find try_statement
  function findTry(node) {
    if (!node) return null;
    if (node.type === 'try_statement') return node;
    for (const c of node.children || []) {
      const res = findTry(c);
      if (res) return res;
    }
    return null;
  }
  
  const tryNode = findTry(normalized);
  if (tryNode) {
    console.log("Found try_statement with children:");
    for (const c of tryNode.children) {
      if (c && c.named) {
        console.log(" - " + c.type);
      }
    }
  } else {
    console.log("Not found");
  }
}

debugAst(Python, "try:\\n    print('try')\\nexcept Exception as e:\\n    print('catch')\\nfinally:\\n    print('finally')", 'PYTHON');

debugAst(Java, "class Test { \\n void test() { \\n try { System.out.println('try'); } catch (Exception e) { System.out.println('catch'); } finally { System.out.println('finally'); } \\n} \\n }", 'JAVA');

debugAst(Cpp, "void test() { try { cout << 'try'; } catch (exception& e) { cout << 'catch'; } }", 'CPP');
