import { generateMermaid } from './src/index.mjs';
import { readFileSync } from 'fs';
import Parser from 'tree-sitter';
import CPP from 'tree-sitter-cpp';

async function debugCppLoop() {
  const code = readFileSync('tests/cpp/DoWhileLoopTest.cpp', 'utf8');
  console.log('Code:', code);
  
  // Let's also manually parse and see what nodes we get
  const parser = new Parser();
  parser.setLanguage(CPP);
  
  const tree = parser.parse(code);
  console.log('AST:', tree.rootNode.toString());
  
  // Let's also check what the cpp-config extractLoopInfo function returns
  const { cppConfig } = await import('./src/mappings/cpp-config.mjs');
  
  // Find the do_statement node
  function findDoStatement(node) {
    if (!node) return null;
    if (node.type === 'do_statement') return node;
    if (node.children) {
      for (const child of node.children) {
        const result = findDoStatement(child);
        if (result) return result;
      }
    }
    return null;
  }
  
  const doStatement = findDoStatement(tree.rootNode);
  if (doStatement) {
    console.log('Do statement:', doStatement.toString());
    const loopInfo = cppConfig.extractLoopInfo(doStatement);
    console.log('Loop info:', loopInfo);
    console.log('Calls count:', loopInfo.calls.length);
    for (let i = 0; i < loopInfo.calls.length; i++) {
      console.log(`Call ${i}:`, loopInfo.calls[i].toString());
    }
  }
  
  const result = await generateMermaid({ code, language: 'cpp' });
  console.log('Result:', result);
}

debugCppLoop().catch(console.error);