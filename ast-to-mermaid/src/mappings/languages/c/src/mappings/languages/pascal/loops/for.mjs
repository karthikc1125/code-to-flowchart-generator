import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../shared/helpers.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map for loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
  const forId = ctx.next();
  
  // Handle Pascal-specific for loop syntax
  let startText = node.start?.text || "";
  let endText = node.end?.text || "";
  let direction = node.direction?.text || "to";
  const forText = `for ${startText} ${direction} ${endText}`;
  ctx.add(forId, decisionShape(forText));
  
  // Connect to previous node and set as last
  linkNext(ctx, forId);
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'for',
    loopId: forId
  });
}