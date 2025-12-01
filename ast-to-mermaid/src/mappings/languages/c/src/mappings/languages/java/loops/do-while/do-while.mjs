/**
 * Do-while loop statement mapping for Java language
 */

import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map do-while loop to Mermaid flowchart nodes
 * Creates decision node for loop condition
 * @param {Object} node - Normalized do-while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDoWhileStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const doWhileId = ctx.next();
  const doWhileText = `while ${node.test?.text || "condition"}`;
  ctx.add(doWhileId, decisionShape(doWhileText));
  
  // Connect to previous node and set as last
  linkNext(ctx, doWhileId);
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'do-while',
    loopId: doWhileId
  });
}