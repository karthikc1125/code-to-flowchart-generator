import { mapLoopStatement as mapForLoop } from './for-loop.mjs';
import { mapWhileLoop } from './while-loop.mjs';
import { mapDoWhileLoop } from './do-while.mjs';
import { mapForInOfLoop } from './for-in-of.mjs';

/**
 * Smart Loop Orchestrator
 * Maps any loop statement (for, while, do-while, for-in, for-of, enhanced-for), delegating to specific handlers.
 * 
 * @param {Object} node - The AST node representing the loop.
 * @param {Object} flow - The flow builder.
 * @param {Object} languageConfig - The language AST configuration.
 * @param {string} last - The ID of the previous node.
 * @param {string} initialLabel - The label coming into this loop (e.g., "yes", "no").
 * @param {Function} processorLocal - The sequence processor to handle internal blocks.
 */
export function mapSmartLoop(node, flow, languageConfig, last, initialLabel = "", processorLocal = null) {
  const processSequenceLocal = processorLocal || languageConfig._processor;

  // The processSequence adapter function to align common-flowchart (which expects `{ last }`)
  // with the new logic mapping files which expect structured logic mapping.
  const adaptedProcessSequence = (nodes, startId, label) => {
      // label could be an array if it comes from a virtual point's multiple labels; take the first or default
      const processedLabel = Array.isArray(label) ? (label[0] || "") : (label || "");
      if (!nodes || nodes.length === 0) {
          return { lastIds: [startId], exitLabels: [processedLabel] };
      }
      if (processSequenceLocal) {
          const result = processSequenceLocal(nodes, flow, languageConfig, startId, processedLabel);
          return {
              lastIds: [result.last],
              exitLabels: [""]
          };
      }
      return { lastIds: [startId], exitLabels: [processedLabel] };
  };

  const info = languageConfig.extractLoopInfo(node) || { type: 'loop' };

  const context = {
      builder: flow,
      prevId: last,
      entryLabel: initialLabel,
      extractInfo: () => info,
      processSequence: adaptedProcessSequence
  };

  let result;
  if (info.type === 'do') {
      result = mapDoWhileLoop(node, context);
  } else if (info.type === 'while') {
      result = mapWhileLoop(node, context);
  } else if (info.type === 'for_in' || info.type === 'for_of' || info.type === 'for_range' || info.type === 'enhanced_for') {
      result = mapForInOfLoop(node, context);
  } else {
      result = mapForLoop(node, context);
  }
  
  return {
      last: result.lastIds[0],
  };
}
