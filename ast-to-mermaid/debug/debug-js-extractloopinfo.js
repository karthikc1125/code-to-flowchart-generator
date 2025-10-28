// Debug script to test extractLoopInfo function
import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';

const testCode = `
for (let i = 0; i < 10; i++) {
    console.log("Iteration: " + i);
}
`;

async function debugAST() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('javascript');
    const tree = parser.parse(testCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Find the for_statement node
    function findForStatement(node) {
      if (!node) return null;
      if (node.type === 'for_statement') return node;
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          const found = findForStatement(child);
          if (found) return found;
        }
      }
      return null;
    }
    
    const forStatement = findForStatement(normalized);
    if (forStatement) {
      console.log('Found for_statement node');
      console.log('Node type:', forStatement.type);
      console.log('Node children types:', forStatement.children?.map(c => c?.type));
      
      const loopInfo = javascriptConfig.extractLoopInfo(forStatement);
      console.log('extractLoopInfo result:', loopInfo);
    } else {
      console.log('No for_statement found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAST();