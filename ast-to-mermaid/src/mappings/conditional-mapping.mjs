import { mapSmartIf } from './statements/conditional/smart-if.mjs';
import { mapSwitch } from './statements/conditional/switch.mjs';

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

  const mapper = {
    getCondition: (n) => (languageConfig.extractConditionInfo(n))?.text || 'condition',
    getThenBranch: (n) => (languageConfig.extractThenBranch(n))?.calls || [],
    getElseBranch: (n) => (languageConfig.extractElseBranch(n))?.calls || []
  };

  const processSequence = (nodes, startId, label) => {
    if (!nodes || nodes.length === 0) {
      return { lastIds: [startId], exitLabels: [label] };
    }

    // Detect nested conditionals to keep the chain status
    const isNextElseIf = nodes.length === 1 && languageConfig.isConditional(nodes[0]);

    if (processSequenceLocal) {
      const result = processSequenceLocal(nodes, flow, languageConfig, startId, label, isNextElseIf);
      return {
        lastIds: [result.last],
        exitLabels: [""]
      };
    }

    // Fallback if no processor
    return { lastIds: [startId], exitLabels: [label] };
  };

  let result;
  if (node.type === 'switch_statement' || node.type === 'match_statement' || node.type === 'switch_expression') {
    result = mapSwitch(node, {
      builder: flow,
      prevId: last,
      entryLabel: initialLabel,
      mapper,
      processSequence,
      disableFallthrough: languageConfig.disableFallthrough
    });
  } else {
    result = mapSmartIf(node, {
      builder: flow,
      prevId: last,
      entryLabel: initialLabel,
      mapper,
      processSequence,
      isElseIf // Pass the status to the smart mapper
    });
  }

  return {
    last: result.lastIds[0],
    pendingConnections: []
  };
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