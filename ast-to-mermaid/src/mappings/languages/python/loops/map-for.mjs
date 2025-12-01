import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map Python for loop to Mermaid flowchart nodes
 * Creates a decision node with proper Python syntax
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
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
  
  // Connect to previous node and set as last
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
}