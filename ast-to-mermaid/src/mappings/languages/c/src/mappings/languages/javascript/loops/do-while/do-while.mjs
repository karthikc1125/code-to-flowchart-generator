import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to extract text from normalized nodes
function extractText(node) {
  if (!node) return "";
  if (typeof node === 'string') return node;
  if (node.text) return node.text;
  return "";
}

/**
 * Map do-while loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized do-while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDoWhileStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the do-while loop condition
  const doWhileId = ctx.next();
  
  // Extract condition text
  let conditionText = extractText(node.test);
  if (!conditionText) conditionText = "condition";
  
  // Create the do-while loop text
  const doWhileText = `while ${conditionText}`;
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