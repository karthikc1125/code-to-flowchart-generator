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
 * Map while loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhileStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the while loop condition
  const whileId = ctx.next();
  
  // Extract condition text
  let conditionText = extractText(node.test);
  if (!conditionText) conditionText = "condition";
  
  // Create the while loop text
  const whileText = `while ${conditionText}`;
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