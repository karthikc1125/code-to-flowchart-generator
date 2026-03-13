/**
 * Loop Statement Logic
 */

export function mapLoopStatement(node, { builder, prevId, entryLabel, extractInfo, processSequence }) {
    // 1. Extract Loop Info
    const info = extractInfo(node) || { type: 'loop', condition: 'condition', calls: [] };
    const loopType = info.type || 'loop';
    const condition = info.condition || 'condition';
    
    // 2. Create Loop Decision Node
    const loopId = builder.addLoopStatement(node, `${loopType}: ${condition}`);

    // Link from previous node
    if (prevId) {
        builder.link(prevId, loopId, entryLabel);
    }

    // 3. Process Loop Body
    const calls = Array.isArray(info.calls) ? info.calls : [];
    if (calls.length > 0) {
        // Process the statements within the loop body
        const bodyRes = processSequence(calls, loopId, "yes");
        
        // Link the very last execution node(s) inside the loop strictly back to the decision start block
        if (bodyRes.lastIds && bodyRes.lastIds.length > 0) {
            bodyRes.lastIds.forEach(id => {
               builder.link(id, loopId);
            });
        } else if (bodyRes.last) {
            builder.link(bodyRes.last, loopId);
        }
    }

    // 4. Ensure execution exits the loop sequentially with a 'no' edge
    const mergePoint = builder.createVirtualPoint(
        [loopId],
        ["no"]
    );

    return {
        lastIds: [mergePoint],
        exitLabels: [""]
    };
}
