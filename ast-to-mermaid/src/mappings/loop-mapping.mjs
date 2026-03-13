import { mapSmartLoop } from './statements/loops/smart-loop.mjs';

/**
 * Standardized Loop Processor
 * 
 * @param {Object} node - The loop statement node
 * @param {Object} flow - The flow builder
 * @param {Object} languageConfig - Language config
 * @param {string} last - Previous node ID
 * @param {string} initialLabel - Label for incoming edge
 * @param {Function} processor - The statement processor (to avoid circular deps)
 */
export function processSingleLoop(node, flow, languageConfig, last, initialLabel = "", processor = null) {
  return mapSmartLoop(node, flow, languageConfig, last, initialLabel, processor);
}
