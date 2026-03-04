/**
 * Generic If-Statement Flowchart Logic
 */

/**
 * Maps a conditional (if) statement to flowchart components.
 * 
 * Constraints:
 * 1. ONLY one incoming pointer (provided via prevId).
 * 2. EXACTLY two outgoing pointers: labeled "yes" and "no".
 * 3. NO extra or duplicated pointers.
 * 
 * @param {Object} node - The AST node representing the 'if' statement.
 * @param {Object} context - The mapping context.
 * @param {Object} context.builder - The flowchart builder.
 * @param {string} context.prevId - The ID of the node leading into this one.
 * @param {string} context.entryLabel - Label for the incoming edge.
 * @param {Object} context.mapper - Language-specific extraction logic.
 * @param {Function} context.processSequence - (nodes, startId, label) => { lastIds: string[], exitLabels: string[] }.
 */
export function mapIf(node, { builder, prevId, entryLabel, mapper, processSequence }) {
    // 1. Create the decision node (Diamond shape)
    const condition = mapper.getCondition(node) || 'condition';
    const ifNodeId = builder.addIfStatement(node, `${condition}?`);

    // Incoming edge
    if (prevId) {
        builder.link(prevId, ifNodeId, entryLabel);
    }

    // 2. Outgoing Branches: "yes" and "no"
    const thenNodes = mapper.getThenBranch(node) || [];
    const thenResult = thenNodes.length > 0
        ? processSequence(thenNodes, ifNodeId, "yes")
        : { lastIds: [ifNodeId], exitLabels: ["yes"] };

    const elseNodes = mapper.getElseBranch(node) || [];
    const elseResult = elseNodes.length > 0
        ? processSequence(elseNodes, ifNodeId, "no")
        : { lastIds: [ifNodeId], exitLabels: ["no"] };

    // 3. Create a VIRTUAL Reference Point (Backend Only)
    // This point collects all exit paths from both branches.
    // In the Mermaid preview, it will expand to direct connections (e.g., B->D, C->D).
    const mergePoint = builder.createVirtualPoint(
        [...thenResult.lastIds, ...elseResult.lastIds],
        [...thenResult.exitLabels, ...elseResult.exitLabels]
    );

    // 4. Return exactly ONE logical exit point for the backend logic
    return {
        lastIds: [mergePoint],
        exitLabels: [""]
    };
}
