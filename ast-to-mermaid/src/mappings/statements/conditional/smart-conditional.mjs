import { mapSmartIf } from './smart-if.mjs';
import { mapSwitch } from './switch.mjs';

/**
 * Smart Conditional Orchestrator
 * Maps any conditional statement (if/else-if/else or switch), keeping track of the depth and chaining exactly.
 * 
 * @param {Object} node - The AST node representing the conditional.
 * @param {Object} flow - The flow builder.
 * @param {Object} languageConfig - The language AST configuration.
 * @param {string} last - The ID of the previous node.
 * @param {string} initialLabel - The label coming into this conditional (e.g., "yes", "no").
 * @param {Function} processor - The sequence processor to handle internal blocks.
 * @param {boolean} isElseIf - Indicates whether this specific statement should be marked as an 'else if'.
 */
export function mapSmartConditional(node, flow, languageConfig, last, initialLabel = "", processor = null, isElseIf = false) {
    // Determine how to extract logic from the AST node
    const mapper = {
        getCondition: (n) => (languageConfig.extractConditionInfo(n))?.text || 'condition',
        getThenBranch: (n) => (languageConfig.extractThenBranch(n))?.calls || [],
        getElseBranch: (n) => (languageConfig.extractElseBranch(n))?.calls || []
    };

    /**
     * Enhanced process sequence specifically designed to safely handle nested depth `n`.
     * It correctly determines whether a nested block contains an `else if` chain or a fresh `if` statement.
     */
    const smartProcessSequence = (nodes, startId, label) => {
        if (!nodes || nodes.length === 0) {
            return { lastIds: [startId], exitLabels: [label] };
        }

        // The core fix: An inner conditional is an `else if` ONLY if it is:
        // 1. The ONLY statement in the block (nodes.length === 1)
        // 2. A conditional statement
        // 3. Inside an `else` branch (label === "no")
        const checkElseIf = label === "no" && nodes.length === 1 && languageConfig.isConditional(nodes[0]);

        if (processor) {
            // Process the nested block utilizing our smart else-if check
            const result = processor(nodes, flow, languageConfig, startId, label, checkElseIf);
            return {
                lastIds: [result.last],
                exitLabels: [""]
            };
        }

        return { lastIds: [startId], exitLabels: [label] };
    };

    let result;
    if (node.type === 'switch_statement' || node.type === 'match_statement' || node.type === 'switch_expression') {
        result = mapSwitch(node, {
            builder: flow,
            prevId: last,
            entryLabel: initialLabel,
            mapper,
            processSequence: smartProcessSequence,
            disableFallthrough: languageConfig.disableFallthrough
        });
    } else {
        result = mapSmartIf(node, {
            builder: flow,
            prevId: last,
            entryLabel: initialLabel,
            mapper,
            processSequence: smartProcessSequence,
            isElseIf // The flag securely determined from the parent chain
        });
    }

    return {
        last: result.lastIds[0],
        pendingConnections: []
    };
}
