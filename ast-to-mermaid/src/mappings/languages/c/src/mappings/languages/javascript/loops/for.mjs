import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

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
 * Map for loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
  const forId = ctx.next();
  
  // Extract loop components for better text representation
  let initText = "";
  let testText = "";
  let updateText = "";
  
  // Handle initialization
  initText = extractText(node.init);
  if (!initText) initText = "init";
  
  // Handle condition
  testText = extractText(node.test);
  if (!testText) testText = "condition";
  
  // Handle update
  updateText = extractText(node.update);
  if (!updateText) updateText = "update";
  
  // Clean up the init text to remove trailing semicolon if present
  if (initText.endsWith(';')) {
    initText = initText.slice(0, -1);
  }
  
  // Combine init, condition, and update into a single text
  // Format as: for (init; test; update)
  const forText = `for (${initText}; ${testText}; ${updateText})`;
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