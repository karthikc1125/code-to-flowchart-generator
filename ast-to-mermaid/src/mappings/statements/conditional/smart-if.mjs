/**
 * Smart If-Statement Logic with Keyword Detection
 */

/**
 * Maps a conditional (if/else if) statement to flowchart components.
 * 
 * @param {Object} node - The AST node representing the statement.
 * @param {Object} context - The mapping context.
 */
export function mapSmartIf(node, { builder, prevId, entryLabel, mapper, processSequence, isElseIf }) {
    // 1. Determine the keyword (if, else if, elif)
    let keyword = isElseIf ? 'else if' : 'if';

    // Check if the language specifically uses 'elif' (like Python)
    if (isElseIf && (node.type === 'elif_clause' || (typeof node.text === 'string' && node.text.trim().startsWith('elif')))) {
        keyword = 'elif';
    }

    // 2. Create the decision node with the prefix
    const condition = mapper.getCondition(node) || 'condition';
    const ifNodeId = builder.addIfStatement(node, `${keyword}: ${condition}?`);

    // Link from previous node
    if (prevId) {
        builder.link(prevId, ifNodeId, entryLabel);
    }

    // 3. Process Branches
    const thenNodes = mapper.getThenBranch(node) || [];
    const thenResult = thenNodes.length > 0
        ? processSequence(thenNodes, ifNodeId, "yes")
        : { lastIds: [ifNodeId], exitLabels: ["yes"] };

    const elseNodes = mapper.getElseBranch(node) || [];
    const elseResult = elseNodes.length > 0
        ? processSequence(elseNodes, ifNodeId, "no")
        : { lastIds: [ifNodeId], exitLabels: ["no"] };

    // 4. Create a Virtual Reference Point for clean merge
    // This connects all exits from branches to a single logical exit point
    const mergePoint = builder.createVirtualPoint(
        [...thenResult.lastIds, ...elseResult.lastIds],
        [...thenResult.exitLabels, ...elseResult.exitLabels]
    );

    return {
        lastIds: [mergePoint],
        exitLabels: [""]
    };
}
