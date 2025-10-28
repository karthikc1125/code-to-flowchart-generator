// Debug script to see how Python assignments are processed
import { loadParserForLanguage } from './src/parser.mjs';
import { normalizeTree } from './src/normalize.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';

const testCode = `x = 2
print("Hello")
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
    
    console.log('=== Python Assignment AST ===');
    walk(normalized);
    
    // Test the Python configuration functions
    console.log('\n=== Testing Python Config Functions ===');
    
    // Find the assignment node
    function findAssignmentNode(node) {
      if (!node) return null;
      if (pythonConfig.isAssignment(node)) return node;
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          const found = findAssignmentNode(child);
          if (found) return found;
        }
      }
      return null;
    }
    
    const assignmentNode = findAssignmentNode(normalized);
    if (assignmentNode) {
      console.log('Found assignment node:', assignmentNode.type);
      console.log('isAssignment:', pythonConfig.isAssignment(assignmentNode));
      console.log('extractVariableInfo:', pythonConfig.extractVariableInfo(assignmentNode));
    } else {
      console.log('No assignment node found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAST();