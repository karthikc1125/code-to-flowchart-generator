// Debug script to see what candidate nodes are being processed for Python
import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';

const testCode = `x = 2

match x:
    case 1:
        print("One")
    case 2:
        print("Two")
    case _:
        print("Other")

print("End of program")
`;

async function debugAST() {
  try {
    const { parser, languageModule } = await loadParserForLanguage('python');
    const tree = parser.parse(testCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Simple function to walk and print the AST
    function walk(node, depth = 0) {
      if (!node) return;
      const indent = '  '.repeat(depth);
      console.log(`${indent}${node.type}: "${node.text?.substring(0, 50)}${node.text?.length > 50 ? '...' : ''}"`);
      
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          if (child) {
            walk(child, depth + 1);
          }
        }
      }
    }
    
    console.log('=== Full Python AST ===');
    walk(normalized);
    
    // Find the root node
    const rootNode = normalized;
    console.log('\n=== Root Node ===');
    console.log('Root type:', rootNode.type);
    console.log('Root children count:', rootNode.children ? rootNode.children.length : 0);
    
    // Determine which nodes to process
    const candidateNodesRaw = typeof pythonConfig.findStatementNodes === 'function'
      ? (pythonConfig.findStatementNodes(rootNode) || [])
      : (rootNode.children || []);
    const candidateNodes = Array.isArray(candidateNodesRaw) ? candidateNodesRaw : Array.from(candidateNodesRaw || []);
    
    console.log('\n=== Candidate Nodes ===');
    console.log('Candidate nodes count:', candidateNodes.length);
    for (let i = 0; i < candidateNodes.length; i++) {
      const node = candidateNodes[i];
      if (node) {
        console.log(`  ${i}: ${node.type} - "${node.text?.substring(0, 30)}${node.text?.length > 30 ? '...' : ''}"`);
      } else {
        console.log(`  ${i}: null`);
      }
    }
    
    // Test each candidate node to see what the Python config recognizes
    console.log('\n=== Node Recognition ===');
    for (let i = 0; i < candidateNodes.length; i++) {
      const node = candidateNodes[i];
      if (!node) continue;
      
      console.log(`Node ${i} (${node.type}):`);
      console.log(`  isAssignment: ${pythonConfig.isAssignment ? pythonConfig.isAssignment(node) : 'undefined'}`);
      console.log(`  isConditional: ${pythonConfig.isConditional ? pythonConfig.isConditional(node) : 'undefined'}`);
      console.log(`  isOutputCall: ${pythonConfig.isOutputCall ? pythonConfig.isOutputCall(node) : 'undefined'}`);
      
      if (pythonConfig.isAssignment && pythonConfig.isAssignment(node)) {
        console.log(`  extractVariableInfo: ${JSON.stringify(pythonConfig.extractVariableInfo ? pythonConfig.extractVariableInfo(node) : 'undefined')}`);
      }
      
      if (pythonConfig.isConditional && pythonConfig.isConditional(node)) {
        console.log(`  extractConditionInfo: ${JSON.stringify(pythonConfig.extractConditionInfo ? pythonConfig.extractConditionInfo(node) : 'undefined')}`);
      }
      
      if (pythonConfig.isOutputCall && pythonConfig.isOutputCall(node)) {
        console.log(`  extractOutputInfo: ${JSON.stringify(pythonConfig.extractOutputInfo ? pythonConfig.extractOutputInfo(node) : 'undefined')}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAST();