/**
 * Link current node to the next node in the flow
 * Handles pending joins and standard connections
 * @param {Object} ctx - Context object
 * @param {string} nodeId - ID of the current node
 */
export function linkNext(ctx, nodeId) {
  if (!ctx || !nodeId) return;

  // If we have pending joins, resolve them to this node
  if (ctx.resolvePendingJoins && ctx.resolvePendingJoins(nodeId)) {
    return;
  }

  // Standard connection from previous node
  if (ctx.last) {
    ctx.addEdge(ctx.last, nodeId);
  }

  // Update last node reference
  ctx.last = nodeId;
}

/**
 * Handle branch connection for conditional statements
 * @param {Object} ctx - Context object
 * @param {string} nodeId - ID of the current node
 * @param {Object} options - Connection options
 */
export function handleBranchConnection(ctx, nodeId, options = {}) {
  if (!ctx || !nodeId) return false;

  // If context has specific branch handling, use it
  if (ctx.handleBranchConnection) {
    return ctx.handleBranchConnection(nodeId, options);
  }

  // Fallback to standard linking
  linkNext(ctx, nodeId);
  return true;
}

/**
 * Sanitize node text according to VTU flowchart rules
 * @param {string} text - Raw node text
 * @returns {string} - Sanitized text
 */
export const sanitizeNodeText = (text, options = {}) => {
  const { wrap = true } = options;
  if (!text) return "";
  
  // Remove inner double quotes
  let sanitized = text.replace(/"/g, "");
  
  // Replace newlines with escaped newlines
  sanitized = sanitized.replace(/\n/g, "\\n");
  
  // Trim spaces
  sanitized = sanitized.trim();
  
  if (wrap) {
    return `"${sanitized}"`;
  }
  
  return sanitized;
};