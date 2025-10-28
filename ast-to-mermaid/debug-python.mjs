import { generateMermaid } from './src/index.mjs';
import { readFileSync } from 'fs';

async function debugPython() {
  const code = readFileSync('tests/python/WhileLoopTest.py', 'utf8');
  console.log('Code:', code);
  
  // Let's also manually parse and see what nodes we get
  const Parser = (await import('tree-sitter')).default;
  const Python = (await import('tree-sitter-python')).default;
  
  const parser = new Parser();
  parser.setLanguage(Python);
  
  const tree = parser.parse(code);
  console.log('AST:', tree.rootNode.toString());
  
  const result = await generateMermaid({ code, language: 'python' });
  console.log('Result:', result);
}

debugPython().catch(console.error);