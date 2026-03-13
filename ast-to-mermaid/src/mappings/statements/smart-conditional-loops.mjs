import { mapSmartConditional } from './conditional/smart-conditional.mjs';
import { mapSmartLoop } from './loops/smart-loop.mjs';
import { mapTryCatch } from './try-catch-block.mjs';

/**
 * Smart Conditional & Loops N-Depth Orchestrator
 * 
 * This module processes nested, N-depth tree structures for loops and conditionals, 
 * guaranteeing that recursive hierarchies are structurally preserved instead of flattened.
 */

export function isComplexBlock(node, languageConfig) {
    const isCond = languageConfig.isConditional && languageConfig.isConditional(node);
    const isLoop = languageConfig.isLoop && languageConfig.isLoop(node);
    const isTry = languageConfig.isTryCatch && languageConfig.isTryCatch(node);
    return isCond || isLoop || isTry;
}

export function processComplexBlock(node, flow, languageConfig, last, initialLabel = "", processSequenceRecursive = null, isElseIf = false) {
    // 1. Conditionals (If/Else, Switch)
    if (languageConfig.isConditional && languageConfig.isConditional(node)) {
        return mapSmartConditional(node, flow, languageConfig, last, initialLabel, processSequenceRecursive, isElseIf);
    }
    
    // 2. Loops (For, While, Do-While, Enhanced)
    if (languageConfig.isLoop && languageConfig.isLoop(node)) {
        return mapSmartLoop(node, flow, languageConfig, last, initialLabel, processSequenceRecursive);
    }

    // 3. Try/Catch Blocks
    if (languageConfig.isTryCatch && languageConfig.isTryCatch(node)) {
        return mapTryCatch(node, flow, languageConfig, last, initialLabel, processSequenceRecursive);
    }
    
    return { last };
}
