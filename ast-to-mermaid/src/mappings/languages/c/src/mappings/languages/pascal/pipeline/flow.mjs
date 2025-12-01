/**
 * Pascal flowchart generator
 * Converts Pascal source code to Mermaid flowchart
 */

import Parser from 'tree-sitter';
import Pascal from 'tree-sitter-pascal';
import { ctx } from '../mermaid/context.mjs';
import { walk } from '../walkers/walk.mjs';
import { mapNodePascal } from '../map-node-pascal.mjs';

/**
 * Generate Mermaid flowchart from Pascal source code
 * @param {string} sourceCode - Pascal source code
 * @returns {string} Mermaid flowchart diagram
 */
export function generateFlowchart(sourceCode) {
  // Initialize parser
  const parser = new Parser();
  parser.setLanguage(Pascal);
  
  // Parse the source code
  const tree = parser.parse(sourceCode);
  
  // Create context for flowchart generation
  const context = ctx();
  
  // Add handle function to context
  context.handle = (node) => {
    if (node && node.type) {
      mapNodePascal(node, context);
    }
  };
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // Walk the AST and generate flowchart elements
  walk(tree.rootNode, context);
  
  // Add end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  
  // Connect last node to end node
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  
  // Return the generated Mermaid diagram
  return context.emit();
}