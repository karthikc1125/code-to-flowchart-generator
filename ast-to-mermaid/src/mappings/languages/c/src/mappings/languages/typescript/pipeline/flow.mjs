import { extractTypeScript } from '../extractors/typescript-extractor.mjs';
import { normalizeTypescriptAst } from '../normalizer/normalize-typescript.mjs';
import { walk } from '../walkers/walk.mjs';
import { ctx } from '../mermaid/context.mjs';
import { finalizeFlowContext } from '../mermaid/finalize-context.mjs';

// Import TypeScript mapping functions
import { mapIfStatement } from '../conditional/if.mjs';
import { mapIfElseStatement } from '../conditional/if-else/if-else.mjs';
import { mapIfElseIfStatement } from '../conditional/if-elseif/if-elseif.mjs';
import { mapSwitchStatement, mapCase, mapDefault } from '../conditional/switch/switch.mjs';
import { completeSwitch } from '../mappings/common/common.mjs';

// Import TypeScript loop mapping functions
import { mapForStatement } from '../loops/for/for.mjs';
import { mapWhileStatement } from '../loops/while/while.mjs';
import { mapDoWhileStatement } from '../loops/do-while/do-while.mjs';

// Import shapes for creating nodes
import { shapes } from '../mermaid/shapes.mjs';

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

// Helper function to link nodes sequentially
import { linkNext } from '../mappings/common/common.mjs';

/**
 * Map TypeScript nodes to Mermaid flowchart nodes
 * @param {Object} node - Normalized TypeScript node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapNodeTypescript(node, ctx, mapper) {
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
    case "For":
      // Handle for loops
      const forId = ctx.next();
      
      // Extract loop components for better text representation
      let initText = "";
      let testText = "";
      let updateText = "";
      
      // Handle initialization
      if (node.init) {
        if (typeof node.init === 'string') {
          initText = node.init;
        } else if (node.init.text) {
          initText = node.init.text;
        } else if (node.init.type) {
          // For complex init nodes, use their text representation
          initText = node.init.text || "init";
        } else {
          initText = "init";
        }
        
        // Remove trailing semicolon from init text if present
        if (initText.endsWith(';')) {
          initText = initText.slice(0, -1);
        }
      }
      
      // Handle test condition
      if (node.test) {
        if (typeof node.test === 'string') {
          testText = node.test;
        } else if (node.test.text) {
          testText = node.test.text;
        } else if (node.test.type) {
          // For complex test nodes, use their text representation
          testText = node.test.text || "condition";
        } else {
          testText = "condition";
        }
      }
      
      // Handle update
      if (node.update) {
        if (typeof node.update === 'string') {
          updateText = node.update;
        } else if (node.update.text) {
          updateText = node.update.text;
        } else if (node.update.type) {
          // For complex update nodes, use their text representation
          updateText = node.update.text || "update";
        } else {
          updateText = "update";
        }
      }
      
      // Combine into a single text for the decision node
      const forText = `for (${initText}; ${testText}; ${updateText})`;
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
      // Handle while loops
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
    case "DoWhile":
      // Handle do-while loops
      const doWhileId = ctx.next();
      
      // Extract condition text
      let doWhileTestText = "";
      if (node.test) {
        if (typeof node.test === 'string') {
          doWhileTestText = node.test;
        } else if (node.test.text) {
          doWhileTestText = node.test.text;
        } else if (node.test.type) {
          // For complex test nodes, use their text representation
          doWhileTestText = node.test.text || "condition";
        } else {
          doWhileTestText = "condition";
        }
      }
      
      const doWhileText = `while ${doWhileTestText}`;
      ctx.add(doWhileId, decisionShape(doWhileText));
      
      // Connect to previous node using shared linking logic
      linkNext(ctx, doWhileId);
      
      // Store loop information for later connection
      ctx.pendingLoops = ctx.pendingLoops || [];
      ctx.pendingLoops.push({
        type: 'do-while',
        loopId: doWhileId
      });
      
      // Set loop context
      ctx.inLoop = true;
      ctx.loopContinueNode = doWhileId;
      break;
    case "IO": 
      // Handle IO statements (console.log)
      if (node.text) {
        const id = ctx.next();
        // Remove quotes from the text for cleaner display
        let displayText = node.text;
        if (displayText.includes('console.log')) {
          // Extract content between parentheses and remove quotes
          const match = displayText.match(/console\.log\s*\((.*)\)/);
          if (match && match[1]) {
            displayText = match[1].trim();
            // Remove surrounding quotes if present
            if ((displayText.startsWith('"') && displayText.endsWith('"')) || 
                (displayText.startsWith("'") && displayText.endsWith("'"))) {
              displayText = displayText.substring(1, displayText.length - 1);
            }
          }
        }
        ctx.add(id, `[/"console.log(${displayText})"/]`); // IO shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Decl": 
      // Handle variable declarations
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`); // Process shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Assign": 
      // Handle assignments
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`); // Process shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Expr": 
      // Handle expressions
      // Special handling for break statements
      if (node.text === 'break;') {
        // Handle break statements in switch cases
        if (ctx.currentSwitchId) {
          // Create a break node
          const breakId = ctx.next();
          ctx.add(breakId, `["break;"\]`);
          
          // Connect to the previous statement
          if (ctx.last) {
            ctx.addEdge(ctx.last, breakId);
          }
          ctx.setLast(breakId);
          
          // Track this break statement for later connection to the end of the switch
          if (!ctx.pendingBreaks) {
            ctx.pendingBreaks = [];
          }
          
          // Get the current switch level
          const switchLevel = ctx.switchEndNodes ? ctx.switchEndNodes.length - 1 : 0;
          ctx.pendingBreaks.push({
            breakId: breakId,
            switchLevel: switchLevel,
            nextStatementId: 'NEXT_AFTER_SWITCH' // Will be resolved in finalize context
          });
          break;
        } else {
          // Break outside of switch (e.g., in loops) - treat as regular statement
          const id = ctx.next();
          ctx.add(id, `["break;"\]`);
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
          break;
        }
      }
      
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`); // Process shape
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
      break;
    case "Switch":
      // Handle switch statements
      return mapSwitchStatement(node, ctx, mapper);
    case "Case":
      // Handle case statements
      return mapCase(node, ctx, mapper);
    case "Default":
      // Handle default case
      return mapDefault(node, ctx, mapper);
    case "Break":
      // Handle break statements in switch cases
      if (ctx.currentSwitchId) {
        // Create a break node
        const breakId = ctx.next();
        ctx.add(breakId, `["break;"\]`);
        
        // Connect to the previous statement
        if (ctx.last) {
          ctx.addEdge(ctx.last, breakId);
        }
        ctx.setLast(breakId);
        
        // Track this break statement for later connection to the end of the switch
        if (!ctx.pendingBreaks) {
          ctx.pendingBreaks = [];
        }
        
        // Get the current switch level
        const switchLevel = ctx.switchEndNodes ? ctx.switchEndNodes.length - 1 : 0;
        ctx.pendingBreaks.push({
          breakId: breakId,
          switchLevel: switchLevel,
          nextStatementId: 'NEXT_AFTER_SWITCH' // Will be resolved in finalize context
        });
      } else {
        // Break outside of switch (e.g., in loops) - treat as regular statement
        const id = ctx.next();
        ctx.add(id, `["break;"\]`);
        if (ctx.last) {
          ctx.addEdge(ctx.last, id);
        }
        ctx.setLast(id);
      }
      break;
    default:
      // For unhandled node types, create a generic process node
      if (node.text) {
        const id = ctx.next();
        ctx.add(id, `["${node.text}"]`);
        // Use branch connection logic if we're in a branch, otherwise use direct connection
        if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
          ctx.handleBranchConnection(id);
        } else {
          if (ctx.last) {
            ctx.addEdge(ctx.last, id);
          }
          ctx.setLast(id);
        }
      }
  }
}

/**
 * Generate VTU-style Mermaid flowchart from TypeScript source code
 * @param {string} sourceCode - TypeScript source code
 * @returns {string} - Mermaid flowchart
 */
export function generateFlowchart(sourceCode) {
  
  // 1. Extract AST using Tree-sitter
  const ast = extractTypeScript(sourceCode);
  
  // 2. Normalize AST to unified node types
  const normalized = normalizeTypescriptAst(ast);
  
  // 3. Create context for flowchart generation
  const context = ctx();
  
  // Add handle function to context to match JavaScript implementation
  context.handle = (node) => {
    if (node && node.type) {
      mapNodeTypescript(node, context, context.handle);
    }
  };
  
  // 4. Walk and generate nodes using mapping functions
  if (normalized) {
    // Walk the entire normalized AST directly
    walk(normalized, context);
  }
  
  // Finalize the context
  finalizeFlowContext(context);
  
  // 5. Emit final Mermaid flowchart
  return context.emit();
}