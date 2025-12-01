/**
 * While loop statement mapping for Java language
 */

import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map while loop to Mermaid flowchart nodes
 * Creates decision node for loop condition
 * @param {Object} node - Normalized while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhileStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const whileId = ctx.next();
  const whileText = `while ${node.test?.text || "condition"}`;
  ctx.add(whileId, decisionShape(whileText));
  
  // Connect to previous node and set as last
  linkNext(ctx, whileId);
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'while',
    loopId: whileId
  });
}