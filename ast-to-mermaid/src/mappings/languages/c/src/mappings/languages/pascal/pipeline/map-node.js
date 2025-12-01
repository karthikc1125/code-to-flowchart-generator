/**
 * Node mapping pipeline for Pascal language
 * Maps normalized AST nodes to Mermaid diagram elements
 */

import { mapIf } from '../conditional/if.mjs';
import { mapIfElseIf } from '../conditional/if-elseif/if-elseif.mjs';
import { mapCase, mapCaseOption, mapElseCase } from '../conditional/switch/switch.mjs';

/**
 * Map a normalized AST node to Mermaid diagram elements
 * @param {Object} node - Normalized AST node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNode(node, ctx) {
  if (!node || !ctx) return;

  // Handle different node types
  switch (node.type) {
    // Conditional statements
    case 'If':
      mapIf(node, ctx);
      break;
      
    case 'IfElseIf':
      mapIfElseIf(node, ctx);
      break;
      
    // Switch/Case statements
    case 'Case':
      mapCase(node, ctx);
      break;
      
    case 'CaseOption':
      mapCaseOption(node, ctx);
      break;
      
    case 'ElseCase':
      mapElseCase(node, ctx);
      break;
      
    // TODO: Add more node type mappings as needed
    default:
      // For unmapped node types, we could either:
      // 1. Skip them (current approach)
      // 2. Create a generic node representation
      // 3. Log a warning for debugging
      break;
  }
}