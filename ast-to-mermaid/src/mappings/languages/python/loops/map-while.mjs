import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map Python while loop to Mermaid flowchart nodes
 * Creates a decision node with proper Python syntax
 * @param {Object} node - Normalized while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhile(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the while loop
  const whileId = ctx.next();
  
  // Extract condition text
  let condText = "";
  if (node.cond) {
    if (typeof node.cond === 'string') {
      condText = node.cond;
    } else if (node.cond.text) {
      condText = node.cond.text;
    } else {
      condText = "condition";
    }
  }
  
  // Create while loop text (Python syntax)
  const whileText = `while ${condText}`;
  ctx.add(whileId, decisionShape(whileText));
  
  // Connect to previous node and set as last
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
}