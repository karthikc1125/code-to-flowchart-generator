/**
 * IO function mapping for Python language
 * Handles input/output operations with proper text sanitization
 */
import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to sanitize text by removing inner double quotes but preserving outer quotes for Mermaid
const sanitizeText = (text) => {
  if (!text) return "";
  // Remove double quotes from within the text but preserve the outer structure
  let sanitized = text.replace(/"/g, '');
  // Escape any remaining special characters for Mermaid
  sanitized = sanitized.replace(/\\/g, '\\\\');
  return sanitized;
};

// Helper function to create IO shape with sanitized text enclosed in double quotes
const ioShape = (text) => {
  const sanitizedText = sanitizeText(text);
  // Use parallelogram shape for IO operations with text enclosed in double quotes
  return shapes.parallelogram.replace('{}', `"${sanitizedText}"`);
};

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
}