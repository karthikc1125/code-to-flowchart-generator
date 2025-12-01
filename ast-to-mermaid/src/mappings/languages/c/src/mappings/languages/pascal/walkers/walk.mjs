// Keep track of statement nodes that have been processed as loop bodies
const processedLoopStatements = new WeakSet();

// Keep track of nodes that are already being processed to avoid duplication
// const processingNodes = new WeakSet();

export function walk(node, ctx) {
  if (!node) return;

  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
  }

  // Special handling for If nodes to process then and else branches
  if (node.type === 'if' || node.type === 'ifElse') {
    // Process condition first
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type !== 'statement' && child.type !== 'block' && child.type !== 'kThen' && child.type !== 'kElse') {
        walk(child, ctx);
      }
    }
    
    // Process then branch
    const thenStatement = findThenStatement(node);
    if (thenStatement) {
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('then');
        walk(thenStatement, ctx);
        if (typeof ctx.exitBranch === 'function') {
          ctx.exitBranch('then');
        }
      }
    }
    
    // Process else branch if it exists
    const elseStatement = findElseStatement(node);
    if (elseStatement) {
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('else');
        walk(elseStatement, ctx);
        if (typeof ctx.exitBranch === 'function') {
          ctx.exitBranch('else');
        }
      }
    }
    
    // Complete the if statement
    if (typeof ctx?.completeIf === 'function') {
      ctx.completeIf();
    }
    
    return;
  }
  
  // Handle loop completion - follow C pattern exactly
  const loopTypes = ['for', 'while', 'repeat'];
  if (loopTypes.includes(node.type)) {
    // For Pascal loops, walk ONLY the body and nothing else
    // Find and walk the actual loop body (statement, block, or statements)
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      // Only walk statement, block, or statements children that are the actual body
      // This ensures we don't walk loop variables, conditions, etc.
      if (child && (child.type === 'statement' || child.type === 'block' || child.type === 'statements')) {
        walk(child, ctx);
        // In Pascal, loops have a single body, so we can break after the first one
        break;
      }
    }

    // Complete the loop to resolve connections back to loop condition
    if (typeof ctx?.completeLoop === 'function') {
      ctx.completeLoop();
    }

    // Do not process any children of this loop node to prevent duplication
    return;
  }
  
  if (node.type === 'statement') {
    // Process statement nodes by walking their children
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        // Walk the child node (this will handle it appropriately)
        walk(child, ctx);
      }
    }
    return;
  }
  
  if (node.type === 'statements') {
    // Process statements nodes by walking their children
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        // Walk the child node (this will handle it appropriately)
        walk(child, ctx);
      }
    }
    return;
  }
  
  // Process all children of the node
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      walk(child, ctx);
    }
  }
}

/**
 * Find then statement in an if statement
 * @param {Object} node - If statement node
 * @returns {Object|null} Then statement node or null
 */
function findThenStatement(node) {
  if (!node || !node.childCount) return null;
  
  let foundThen = false;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === 'kThen') {
      foundThen = true;
      continue;
    }
    
    if (foundThen && child && (child.type === 'statement' || child.type === 'block')) {
      return child;
    }
  }
  
  return null;
}

/**
 * Find else statement in an if statement
 * @param {Object} node - If statement node
 * @returns {Object|null} Else statement node or null
 */
function findElseStatement(node) {
  if (!node || !node.childCount) return null;
  
  let foundElse = false;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === 'kElse') {
      foundElse = true;
      continue;
    }
    
    if (foundElse && child && (child.type === 'statement' || child.type === 'block')) {
      return child;
    }
  }
  
  return null;
}