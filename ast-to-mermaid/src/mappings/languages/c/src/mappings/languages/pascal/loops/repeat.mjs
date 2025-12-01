import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../shared/helpers.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map repeat-until loop to Mermaid flowchart nodes
 * Creates decision node for loop condition
 * @param {Object} node - Normalized repeat-until loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapRepeat(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const repeatId = ctx.next();
  const repeatText = `repeat until ${node.cond?.text || "condition"}`;
  ctx.add(repeatId, decisionShape(repeatText));
  
  // Connect to previous node and set as last
  linkNext(ctx, repeatId);
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'repeat',
    loopId: repeatId
  });
}