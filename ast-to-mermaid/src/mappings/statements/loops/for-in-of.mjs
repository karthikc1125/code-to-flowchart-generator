/**
 * For-In / For-Of Loop Statement Logic
 * Handles enhanced for loops across languages (for-in, for-of, enhanced_for, for_range_loop)
 */
export function mapForInOfLoop(node, context) {
    const { builder, prevId, entryLabel, extractInfo, processSequence } = context;
    
    // 1. Extract Loop Info
    const info = extractInfo(node) || { type: 'for_in', condition: 'item in list', calls: [] };
    const condition = info.condition || 'item in list';
    
    // 2. Create Decision Node (acts as the iteration trigger)
    const loopId = builder.addLoopStatement(node, `for each ${condition}`);
    if (prevId) {
        builder.link(prevId, loopId, entryLabel);
    }
    
    // 3. Process Loop Body
    const calls = Array.isArray(info.calls) ? info.calls : [];
    let lastBodyIds = [];
    
    if (calls.length > 0) {
        // Execute the loop body when condition represents 'next item exists' ('yes')
        const bodyRes = processSequence(calls, loopId, "yes");
        if (bodyRes.lastIds && bodyRes.lastIds.length > 0) {
            lastBodyIds = bodyRes.lastIds;
        } else if (bodyRes.last) {
            lastBodyIds = [bodyRes.last];
        } else {
            lastBodyIds = [loopId];
        }
    } else {
        // Empty body still needs to evaluate condition
        lastBodyIds = [loopId];
    }
    
    // 4. Link body back to loop decision
    lastBodyIds.forEach(id => {
        // In case the body was empty, it shouldn't link to itself
        if (id !== loopId) {
            builder.link(id, loopId);
        }
    });
    
    // 5. Create Merge Point for Loop Exit
    const mergePoint = builder.createVirtualPoint(
        [loopId],
        ["no"] // Condition is 'no more items'
    );

    return {
        lastIds: [mergePoint],
        exitLabels: [""]
    };
}
