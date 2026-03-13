import { mapLoopStatement } from './for-loop.mjs';

/**
 * While Loop Statement Logic
 */
export function mapWhileLoop(node, context) {
    // Both 'while' and 'do-while' loops follow the standard flowchart 
    // branching cyclic evaluation as structurally handled by generic loop mapping.
    return mapLoopStatement(node, context);
}
