import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create function definition shape with text
const functionDefinitionShape = (text) => shapes.process.replace('{}', text);

/**
 * Map function definition to Mermaid flowchart nodes
 * @param {Object} node - Normalized function definition node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionDefinition(node, ctx) {
  if (!node || !ctx) return;
  
  // Create function definition node
  const funcId = ctx.next();
  
  // Use the function name if available
  const funcText = node.name || "function";
  ctx.add(funcId, functionDefinitionShape(funcText));
  
  // Connect to previous node and set as last
  linkNext(ctx, funcId);
  
  // Store function definition info for later subgraph creation
  if (!ctx.functionMap) {
    ctx.functionMap = {};
  }
  ctx.functionMap[node.name] = node;
}