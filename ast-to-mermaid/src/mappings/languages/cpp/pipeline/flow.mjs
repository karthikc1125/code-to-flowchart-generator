import { extractCpp } from '../extractors/cpp-extractor.mjs';
import { normalizeCpp } from '../normalizer/normalize-cpp.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import mapping functions
import { mapNode } from './map-node.js';

/**
 * Map C++ nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized C++ node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodeCpp(node, ctx) {
  // Use the new mapNode function that handles all node types including switch
  return mapNode(node, ctx);
}

/**
 * Generate VTU-style Mermaid flowchart from C++ source code
 * @param {string} sourceCode - C++ source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractCpp(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeCpp(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Identify functions (main + user-defined)
  let mainFunction = null;
  const userFunctions = [];

  if (normalized) {
    const collectFunctions = {
      handle: (node) => {
        if (node && node.type === 'Function') {
          if (isMainFunction(node)) {
            mainFunction = node;
          } else {
            userFunctions.push(node);
          }
        }
      }
    };

    walk(normalized, collectFunctions);
  }

  // 5. Walk nodes to build main flowchart
  if (normalized) {
    const target = mainFunction?.body || normalized;
    context.handle = (node) => {
      if (node && node.type) {
        mapNodeCpp(node, context);
      }
    };
    walk(target, context);
    delete context.handle;
  }

  // 6. Finalize main context
  finalizeFlowContext(context);

  // 7. Build subgraphs for user-defined functions (only when a main function exists)
  const subgraphIds = {}; // Map function names to their subgraph IDs
  
  if (mainFunction && userFunctions.length > 0) {
    userFunctions.forEach(fnNode => {
      if (!fnNode?.body) return;

      const fnContext = context.fork();

      // Process function body directly without creating start/end nodes
      fnContext.handle = (node) => {
        if (node && node.type) {
          mapNodeCpp(node, fnContext);
        }
      };
      walk(fnNode.body, fnContext);
      delete fnContext.handle;

      // Finalize function-specific context but don't add end node for subgraphs
      finalizeFlowContext(fnContext, false);

      const subgraphId = context.nextSubgraphId();
      // Extract function name properly by splitting on '(' to remove parameters
      const functionName = fnNode.name ? fnNode.name.split('(')[0].trim() : "anonymous";
      const subgraphLabel = `${subgraphId}["function ${fnNode.name || "anonymous"}"]`;
      const subgraphLines = [
        ...fnContext.nodes,
        ...fnContext.edges
      ];

      context.addSubgraph(subgraphLabel, subgraphLines);

      // Store subgraph ID for function calls to reference
      subgraphIds[functionName] = subgraphId;
    });
  }

  // Store subgraph IDs in main context for function call connections
  context.subgraphIds = subgraphIds;

  // 8. Emit final Mermaid flowchart
  return context.emit();
}

function isMainFunction(node) {
  if (!node?.name) return false;
  const name = node.name.trim();
  return name === 'main' || name === 'main()' || name.startsWith('main');
}