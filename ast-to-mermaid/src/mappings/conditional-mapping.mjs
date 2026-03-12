import { mapSmartConditional } from './statements/conditional/smart-conditional.mjs';

/**
 * Standardized Conditional Processor
 * 
 * @param {Object} node - The if statement node
 * @param {Object} flow - The flow builder
 * @param {Object} languageConfig - Language config
 * @param {string} last - Previous node ID
 * @param {string} initialLabel - Label for incoming edge (e.g. "yes", "no")
 * @param {Function} processor - The statement processor (to avoid circular deps)
 * @param {boolean} isElseIf - Flag indicating if this is an 'else if' condition in a chain
 */
export function processSingleConditional(node, flow, languageConfig, last, initialLabel = "", processor = null, isElseIf = false) {
  // Use the provided processor or fallback to a dummy if not provided (should be provided)
  const processSequenceLocal = processor || languageConfig._processor;

  return mapSmartConditional(node, flow, languageConfig, last, initialLabel, processSequenceLocal, isElseIf);
}

export function processConditionalChain(nodes, flow, languageConfig, last, pendingConnections, processor = null) {
  let currentLast = last;
  let first = true;
  for (const node of nodes) {
    if (node.type === 'else_clause') continue;
    const result = processSingleConditional(node, flow, languageConfig, currentLast, "", processor, !first);
    currentLast = result.last;
    first = false;
  }
  return { last: currentLast, pendingConnections: [] };
}