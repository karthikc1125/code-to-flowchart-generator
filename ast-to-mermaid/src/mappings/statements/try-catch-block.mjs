/**
 * Process Try-Catch-Finally statement blocks.
 * 
 * Visually represents a try block as a subgraph (bounding box).
 * Edges from the try block to the catch block represent the error path (dotted red).
 * 
 * @param {Object} node - The AST node representing the try statement.
 * @param {Object} flow - The flow builder.
 * @param {Object} languageConfig - The language AST configuration.
 * @param {string} last - The ID of the previous node.
 * @param {string} initialLabel - The label coming into this try statement.
 * @param {Function} processor - The sequence processor to handle internal blocks.
 */
export function mapTryCatch(node, flow, languageConfig, last, initialLabel = "", processor = null) {
  if (!languageConfig.extractTryCatchInfo) {
    return { last };
  }

  const { tryBlock, catchBlocks, finallyBlock } = languageConfig.extractTryCatchInfo(node);

  let currentLast = last;
  let tryEntryId = null;
  let tryExitId = null;


  // 1. Try Block Action Node
  let caughtThrows = [];
  if (tryBlock && tryBlock.length > 0) {
    // Create an explicit node to mark the beginning of a try block
    const tryActionId = flow.addAction(node, "try");
    tryEntryId = tryActionId;
    flow.link(currentLast, tryActionId, initialLabel);
    
    // Save existing tracker state to avoid swallowing throws from outer try-blocks
    const existingTracker = flow.throwTracker || [];
    flow.throwTracker = [];
    
    if (processor) {
      const result = processor(tryBlock, flow, languageConfig, tryActionId);
      tryExitId = result.terminated ? null : result.last;
    } else {
      tryExitId = tryActionId;
    }
    
    // Harvest the throws that happened solely inside this try execution subgraph
    caughtThrows = [...flow.throwTracker];
    
    // Restore outer tracker
    flow.throwTracker = existingTracker;
    
    currentLast = tryExitId;
  } else {
    // If empty try block, just create a dummy node to act as the error branch point
    const dummyId = flow.addHiddenPoint(node);
    flow.link(currentLast, dummyId, initialLabel);
    currentLast = dummyId;
    tryExitId = dummyId;
    tryEntryId = dummyId;
  }

  // 2. Catch Blocks
  const catchExitIds = [];
  
  if (catchBlocks && catchBlocks.length > 0) {
    for (const catchBlockInfo of catchBlocks) {
      const { condition, block } = catchBlockInfo;
      let catchHandlerStartId = currentLast; // Fallback
      
      if (block && block.length > 0) {
        // Add specific catch action point using a unique object to avoid ID collisions
        // with the actual first statement of the catch block
        const catchTarget = {};
        
        const conditionText = condition || 'error';
        const catchId = flow.addAction(catchTarget, 'catch: ' + conditionText);
        catchHandlerStartId = catchId;
        
        // **KEY FEATURE**: Link explicit throw paths to this catch block
        for (const tId of caughtThrows) {
          flow.link(tId, catchId, "error");
        }
        
        // **KEY FEATURE**: Link the structural try exit boundary to this catch block
        if (tryExitId) {
          flow.link(tryExitId, catchId, "error");
        }

        if (processor) {
          const result = processor(block, flow, languageConfig, catchId);
          if (!result.terminated) {
            catchExitIds.push(result.last);
          }
        } else {
          catchExitIds.push(catchId);
        }
      }
    }
  }

  // 3. Finally Block
  let finallyStartId = null;
  if (finallyBlock && finallyBlock.length > 0) {
    const finallyTarget = {}; // Use unique object to avoid ID collisions
    const finallyActionId = flow.addAction(finallyTarget, "finally");
    finallyStartId = finallyActionId;
    
    // Both successful try exits AND catch exits must flow into finally
    if (tryExitId) {
      flow.link(tryExitId, finallyActionId, "success");
    }
    
    for (const cExit of catchExitIds) {
      // Connect all resolved catch paths to the finally block
      flow.link(cExit, finallyActionId);
    }
    
    if (processor) {
      const result = processor(finallyBlock, flow, languageConfig, finallyActionId);
      currentLast = result.last;
    } else {
      currentLast = finallyActionId;
    }
  } else {
    // If no finally block, resolving catch blocks means joining them with the successful Try path 
    // at a common merge point (represented generically by just returning multiple pending connection nodes or assigning to a dummy)
    
    if (catchExitIds.length > 0 || tryExitId) {
      // Create a virtual convergence point so paths point directly to the next node
      const mergeIds = [];
      const mergeLabels = [];
      
      if (tryExitId) {
        mergeIds.push(tryExitId);
        mergeLabels.push("success");
      }
      
      for (const cExit of catchExitIds) {
        mergeIds.push(cExit);
        mergeLabels.push("");
      }
      
      if (mergeIds.length > 0) {
        currentLast = flow.createVirtualPoint(mergeIds, mergeLabels);
      }
    }
  }

  const isTerminated = (!finallyBlock || finallyBlock.length === 0) && !tryExitId && catchExitIds.length === 0;
  return { last: currentLast, terminated: isTerminated };
}
