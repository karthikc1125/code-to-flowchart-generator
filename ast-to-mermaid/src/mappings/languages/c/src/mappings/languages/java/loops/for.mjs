/**
 * Loop statement mapping for Java language
 */

import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map for loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapForStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
  const forId = ctx.next();
  
  // Construct init text properly
  let initText = "";
  if (node.init) {
    if (node.init.type === 'AssignmentExpression') {
      // Handle assignment expressions like "i = 0"
      const leftText = node.init.left?.name || node.init.left?.text || 'expression';
      const rightText = node.init.right?.value !== undefined ? node.init.right.value : (node.init.right?.text || 'expression');
      initText = `${leftText} ${node.init.operator} ${rightText}`;
    } else if (node.init.text) {
      // Handle other cases where text is available
      initText = node.init.text;
    } else {
      // Fallback
      initText = "init";
    }
  }
  
  // Combine init, condition, and update into a single text
  const forText = `for (${initText}; ${node.test?.text || ""}; ${node.update?.text || ""})`;
  ctx.add(forId, decisionShape(forText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, forId);
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'for',
    loopId: forId
  });
}