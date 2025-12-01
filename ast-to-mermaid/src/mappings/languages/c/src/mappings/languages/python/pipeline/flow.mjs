import { extractPython } from '../extractors/python-extractor.mjs';
import { normalizePython } from '../normalizer/normalize-python.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../../c/mermaid/context.mjs';

// Import mapping functions (using Python-specific mappings)
import { mapIf } from '../../c/conditional/if.mjs';
import { mapFunction } from '../../c/functions/function-definition.mjs';
import { mapReturn } from '../../c/other-statements/return.mjs';
import { mapAssign } from '../../c/other-statements/assign.mjs';
import { mapIO } from '../../c/io/io.mjs';
import { mapDecl } from '../../c/other-statements/declaration.mjs';
import { mapExpr } from '../../c/other-statements/expression.mjs';
import { mapMatch, mapCase, mapDefault } from '../conditional/switch/switch.mjs';

// Import Python-specific loop mapping functions
import { mapForStatement } from '../loops/for.mjs';
import { mapWhileStatement } from '../loops/while/while.mjs';
import { mapDoWhileStatement } from '../loops/do-while/do-while.mjs';

// Import shapes for creating nodes
import { shapes } from '../../c/mermaid/shapes.mjs';

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to link nodes sequentially
import { linkNext } from '../../c/mappings/common/common.mjs';

/**
 * Map Python nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized Python node
 * @param {Object} ctx - Context for flowchart generation
 */
function mapNodePython(node, ctx) {
  switch (node.type) {
    case "If": return mapIf(node, ctx);
    case "For": 
      // Handle Python for loops with proper text formatting
      const forId = ctx.next();
      
      // Extract loop components for better text representation
      let targetText = "";
      let iterText = "";
      
      // Handle target (variable)
      if (node.target) {
        if (typeof node.target === 'string') {
          targetText = node.target;
        } else if (node.target.text) {
          targetText = node.target.text;
        } else if (node.target.type) {
          // For complex target nodes, use their text representation
          targetText = node.target.text || "variable";
        } else {
          targetText = "variable";
        }
      }
      
      // Handle iterator
      if (node.iter) {
        if (typeof node.iter === 'string') {
          iterText = node.iter;
        } else if (node.iter.text) {
          iterText = node.iter.text;
        } else if (node.iter.type) {
          // For complex iter nodes, use their text representation
          iterText = node.iter.text || "iterator";
        } else {
          iterText = "iterator";
        }
      }
      
      // Combine into a single text for the decision node (Python for loop syntax)
      const forText = `for ${targetText} in ${iterText}`;
      ctx.add(forId, decisionShape(forText));
      
      // Connect to previous node using shared linking logic
      linkNext(ctx, forId);
      
      // Store loop information for later connection
      ctx.pendingLoops = ctx.pendingLoops || [];
      ctx.pendingLoops.push({
        type: 'for',
        loopId: forId
      });
      
      // Set loop context
      ctx.inLoop = true;
      ctx.loopContinueNode = forId;
      break;
    case "While": 
      // Handle Python while loops with proper text formatting
      const whileId = ctx.next();
      
      // Extract condition text
      let whileTestText = "";
      if (node.test) {
        if (typeof node.test === 'string') {
          whileTestText = node.test;
        } else if (node.test.text) {
          whileTestText = node.test.text;
        } else if (node.test.type) {
          // For complex test nodes, use their text representation
          whileTestText = node.test.text || "condition";
        } else {
          whileTestText = "condition";
        }
      }
      
      const whileText = `while ${whileTestText}`;
      ctx.add(whileId, decisionShape(whileText));
      
      // Connect to previous node using shared linking logic
      linkNext(ctx, whileId);
      
      // Store loop information for later connection
      ctx.pendingLoops = ctx.pendingLoops || [];
      ctx.pendingLoops.push({
        type: 'while',
        loopId: whileId
      });
      
      // Set loop context
      ctx.inLoop = true;
      ctx.loopContinueNode = whileId;
      break;
    case "Function": return mapFunction(node, ctx);
    case "Return": return mapReturn(node, ctx);
    case "Assign": return mapAssign(node, ctx);
    case "IO": return mapIO(node, ctx);
    case "Decl": return mapDecl(node, ctx);
    case "Expr": return mapExpr(node, ctx);
    case "Match": return mapMatch(node, ctx);
    case "Case": 
      // Check if this is a default case (wildcard pattern)
      if (node.pattern && node.pattern.type === "Expr" && node.pattern.text === "_") {
        return mapDefault(node, ctx);
      } else {
        return mapCase(node, ctx);
      }
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`);
        if (ctx.last) {
          ctx.addEdge(ctx.last, id);
        }
        ctx.setLast(id);
      }
  }
}

/**
 * Generate VTU-style Mermaid flowchart from Python source code
 * @param {string} sourceCode - Python source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractPython(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizePython(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Find the main program and process its body
    const program = normalized.type === 'Program' ? normalized : 
                   normalized.body?.find(node => node.type === 'Program');
    
    if (program && program.body) {
      // Create a walker context with our handler
      const walkerContext = {
        handle: (node) => mapNodePython(node, context),
        enterBranch: (type) => context.enterBranch(type),
        exitBranch: (type) => context.exitBranch(type),
        completeIf: () => context.completeIf(),
        completeLoop: () => context.completeLoop(), // Add completeLoop to walker context
        // Add direct access to the context for case tracking
        getContext: () => context
      };
      
      // Walk through the program body
      program.body.forEach(node => walk(node, walkerContext));
    }
  }
  
  // Complete any pending branches
  context.completeBranches();
  
  // Add the end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  
  // For switch statements, we need to connect all case end nodes to the end
  if (context.caseEndNodes && context.caseEndNodes.length > 0) {
    context.caseEndNodes.forEach(caseEndId => {
      context.addEdge(caseEndId, endId);
    });
    // Clear the last node since we've connected all case ends
    context.last = null;
  }
  
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  
  // 5. Generate Mermaid diagram
  let diagram = 'graph TD\n';
  diagram += context.nodes.join('\n') + '\n';
  diagram += context.edges.join('\n') + '\n';
  
  return diagram;
}