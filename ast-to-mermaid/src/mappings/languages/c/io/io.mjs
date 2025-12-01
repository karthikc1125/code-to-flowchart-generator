import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

/**
 * Map IO operations to Mermaid flowchart nodes
 * Creates parallelogram nodes for input/output operations
 * @param {Object} node - Normalized IO node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIO(node, ctx) {
  if (!node || !ctx) return;
  
  // Create IO node
  const ioId = ctx.next();
  const ioText = node.text || "IO operation";
  ctx.add(ioId, ioShape(ioText));
  
  linkNext(ctx, ioId);
  
  // If this IO operation contains function calls, store them for later connection
  if (node.functionCalls && Array.isArray(node.functionCalls)) {
    node.functionCalls.forEach(funcName => {
      if (!ctx.functionCalls) {
        ctx.functionCalls = [];
      }
      ctx.functionCalls.push({
        callId: ioId,
        functionName: funcName
      });
    });
  }
}