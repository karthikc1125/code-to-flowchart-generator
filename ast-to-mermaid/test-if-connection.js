import { cConfig } from './src/mappings/c-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Parser from 'tree-sitter';
import C from 'tree-sitter-c';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    const sourceCode = await readFile(join(__dirname, 'test-if-connection.c'), 'utf8');
    
    // Parse the C code
    const parser = new Parser();
    parser.setLanguage(C);
    const tree = parser.parse(sourceCode);
    
    console.log('C AST for test-if-connection.c:');
    console.log(tree.rootNode.toString());
    
    // Debug: Check what nodes are being processed
    console.log('\n\nChecking statement identification:');
    
    const rootNode = tree.rootNode;
    const candidateNodesRaw = typeof cConfig.findStatementNodes === 'function'
      ? (cConfig.findStatementNodes(rootNode) || [])
      : (rootNode.children || []);
    const candidateNodes = Array.isArray(candidateNodesRaw) ? candidateNodesRaw : Array.from(candidateNodesRaw || []);
    
    console.log('Number of candidate nodes found:', candidateNodes.length);
    candidateNodes.forEach((node, index) => {
      if (node) {
        console.log(`Node ${index}: ${node.type} - ${node.text?.substring(0, 50) || ''}`);
        
        // Check different node types
        if (cConfig.isAssignment && cConfig.isAssignment(node)) {
          console.log(`  -> This is an assignment!`);
          const varInfo = cConfig.extractVariableInfo ? cConfig.extractVariableInfo(node) : null;
          console.log(`  -> Variable info:`, varInfo);
        }
        
        if (cConfig.isConditional && cConfig.isConditional(node)) {
          console.log(`  -> This is a conditional!`);
          const condInfo = cConfig.extractConditionInfo ? cConfig.extractConditionInfo(node) : null;
          console.log(`  -> Condition info:`, condInfo);
        }
        
        if (cConfig.isReturnStatement && cConfig.isReturnStatement(node)) {
          console.log(`  -> This is a return statement!`);
          const returnInfo = cConfig.extractReturnInfo ? cConfig.extractReturnInfo(node) : null;
          console.log(`  -> Return info:`, returnInfo);
        }
      }
    });
    
    // Generate the flowchart
    const flowchart = generateCommonFlowchart(tree.rootNode, cConfig);
    console.log('\nGenerated flowchart:');
    console.log(flowchart);
  } catch (error) {
    console.error('Error generating flowchart:', error);
  }
}

main();