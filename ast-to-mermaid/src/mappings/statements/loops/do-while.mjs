import { mapLoopStatement } from './for-loop.mjs';

/**
 * Do-While Loop Statement Logic
 */
export function mapDoWhileLoop(node, context) {
    const { builder, prevId, entryLabel, extractInfo, processSequence } = context;
    
    // 1. Extract Loop Info
    const info = extractInfo(node) || { type: 'do', condition: 'condition', calls: [] };
    const loopType = info.type || 'do';
    const condition = info.condition || 'condition';
    
    // 2. We don't need a Virtual Point for the start, we can just use the prevId
    // But since `do-while` loops back to the start of the body, we need a node to loop back TO
    // If we use a VP, processSequence might not handle it well if VP resolution isn't fully supported
    // Let's create an action point to act as the top of the loop body
    const bodyStartId = builder.addAction('do_while_start_' + node.id, 'do');
    if (prevId) {
        builder.link(prevId, bodyStartId, entryLabel);
    }
    
    // 3. Process Loop Body
    const calls = Array.isArray(info.calls) ? info.calls : [];
    let lastBodyIds = [bodyStartId];
    
    if (calls.length > 0) {
        // Process the statements within the loop body
        const bodyRes = processSequence(calls, bodyStartId, "");
        if (bodyRes.lastIds && bodyRes.lastIds.length > 0) {
            lastBodyIds = bodyRes.lastIds;
        } else if (bodyRes.last) {
            lastBodyIds = [bodyRes.last];
        } else {
            // bodyRes might be just { last: id } from the generic processor
            lastBodyIds = [bodyRes.last || bodyStartId];
        }
    }
    
    // 4. Create Decision Node at the END of the loop
    const loopId = builder.addLoopStatement(node, `while: ${condition}`);
    
    // Link from the end of the body to the decision
    lastBodyIds.forEach(id => {
        builder.link(id, loopId);
    });
    
    // 5. Link 'yes' (condition true) back to the start of the body
    builder.link(loopId, bodyStartId, "yes");
    
    // 6. Ensure execution exits the loop sequentially with a 'no' edge
    const mergePoint = builder.createVirtualPoint(
        [loopId],
        ["no"]
    );

    return {
        lastIds: [mergePoint],
        exitLabels: [""]
    };
}
