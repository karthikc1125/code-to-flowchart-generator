import { extractJavaScript } from '../extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from '../normalizer/normalize-javascript.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import mapping functions (using JavaScript-specific mappings)
import { mapIfStatement } from '../conditional/if.mjs';
import { mapIfElseStatement } from '../conditional/if-else/if-else.mjs';
import { mapIfElseIfStatement } from '../conditional/if-elseif/if-elseif.mjs';
import { mapSwitchStatement, mapCase, mapDefault } from '../conditional/switch/switch.mjs';
import { mapFor } from '../loops/for.mjs';
import { mapWhileStatement } from '../loops/while/while.mjs';
import { mapDoWhileStatement } from '../loops/do-while/do-while.mjs';
import { mapFunctionDeclaration as mapFunction } from '../functions/function.mjs';
import { mapReturn } from '../other-statements/return.mjs';
import { mapAssign } from '../other-statements/assign.mjs';
import { mapIO } from '../io/io.mjs';
import { mapDecl } from '../other-statements/decl.mjs';
import { mapExpr } from '../other-statements/expr.mjs';
import { mapBreakStatement } from '../other-statements/break.mjs';
import { completeSwitch } from '../mappings/common/common.mjs';

/**
 * Map JavaScript nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized JavaScript node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapNodeJavaScript(node, ctx, mapper) {
  switch (node.type) {
    case "If": 
      // Check if this is a simple if, if-else, or if-else-if statement
      if (node.alternate) {
        if (node.alternate.type === 'If') {
          // This is an if-else-if statement
          return mapIfElseIfStatement(node, ctx, mapper);
        } else {
          // This is an if-else statement
          return mapIfElseStatement(node, ctx, mapper);
        }
      } else {
        // This is a simple if statement
        return mapIfStatement(node, ctx, mapper);
      }
    case "Switch": return mapSwitchStatement(node, ctx, mapper);
    case "Case": 
      // Map the case and process its consequent statements
      return mapCase(node, ctx, mapper);
    case "Default": 
      // Map the default and process its consequent statements
      return mapDefault(node, ctx, mapper);
    case "For": return mapFor(node, ctx);
    case "While": return mapWhileStatement(node, ctx);
    case "DoWhile": return mapDoWhileStatement(node, ctx);
    case "Function": return mapFunction(node, ctx);
    case "Return": return mapReturn(node, ctx);
    case "Assign": return mapAssign(node, ctx);
    case "IO": return mapIO(node, ctx);
    case "Decl": return mapDecl(node, ctx);
    case "Expr": return mapExpr(node, ctx);
    case "Break": return mapBreakStatement(node, ctx);
    // Remove Block case since walker handles Block nodes directly
  }
}

/**
 * Generate VTU-style Mermaid flowchart from JavaScript source code
 * @param {string} sourceCode - JavaScript source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractJavaScript(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeJavaScript(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Manually set the start node
  // The context.emit() method already adds START and END nodes
  
  // 4. Walk and generate nodes using mapping functions - match C implementation pattern
  if (normalized) {
    // Add handle function to context
    context.handle = (node) => {
      if (node && node.type) {
        mapNodeJavaScript(node, context, context.handle);
      }
    };
    
    // Find the main program and process it directly - match C approach
    let target = null;
    
    // Check if normalized is the main program itself
    if (normalized.type === 'Program') {
      target = normalized;
    } else {
      target = normalized;
    }
    
    // Walk the target directly - match C approach
    walk(target, context);
    
    // Remove handle function from context
    delete context.handle;
  }
  
  // Finalize the context
  finalizeFlowContext(context);
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}