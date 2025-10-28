import { generateMermaid } from './src/index.mjs';
import { readFileSync } from 'fs';
import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';

async function debugPythonLoop() {
  const code = readFileSync('tests/python/WhileLoopTest.py', 'utf8');
  console.log('Code:', code);
  
  // Let's also manually parse and see what nodes we get
  const parser = new Parser();
  parser.setLanguage(Python);
  
  const tree = parser.parse(code);
  console.log('AST:', tree.rootNode.toString());
  
  // Let's also check what the python-config extractLoopInfo function returns
  const { pythonConfig } = await import('./src/mappings/python-config.mjs');
  
  // Find the while_statement node
  function findWhileStatement(node) {
    if (!node) return null;
    if (node.type === 'while_statement') return node;
    if (node.children) {
      for (const child of node.children) {
        const result = findWhileStatement(child);
        if (result) return result;
      }
    }
    return null;
  }
  
  const whileStatement = findWhileStatement(tree.rootNode);
  if (whileStatement) {
    console.log('While statement:', whileStatement.toString());
    const loopInfo = pythonConfig.extractLoopInfo(whileStatement);
    console.log('Loop info:', loopInfo);
    console.log('Calls count:', loopInfo.calls.length);
    for (let i = 0; i < loopInfo.calls.length; i++) {
      console.log(`Call ${i}:`, loopInfo.calls[i].toString());
    }
  }
  
  const result = await generateMermaid({ code, language: 'python' });
  console.log('Result:', result);
}

debugPythonLoop().catch(console.error);