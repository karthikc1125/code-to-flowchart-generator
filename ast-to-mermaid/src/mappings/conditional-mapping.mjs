// Dedicated mapping file for handling if/else if statements
import { createFlowBuilder } from './_common.mjs';

// Simple recursive function to process statements within conditional branches
function processBranchStatements(calls, flow, languageConfig, last) {
  let currentLast = last;
  let pendingConnections = [];
  
  if (!calls || calls.length === 0) {
    return { last: currentLast, pendingConnections };
  }
  
  for (const call of calls) {
    if (!call) continue;
    
    // Check if this is a conditional statement that needs recursive processing
    if (languageConfig.isConditional && languageConfig.isConditional(call)) {
      // Process nested conditional statements
      const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(call)) || { text: 'condition' };
      const conditionalText = condInfo.text || 'condition';
      
      const condId = flow.addIfStatement(call, `if ${conditionalText}?`);
      flow.link(currentLast, condId);
      
      // Process then branch
      const thenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(call)) || { calls: [] };
      const thenCalls = Array.isArray(thenInfo?.calls) ? thenInfo.calls : [];
      let thenLast = condId;
      let thenPending = [];
      
      if (thenCalls.length > 0) {
        const thenResult = processBranchStatements(thenCalls, flow, languageConfig, thenLast);
        thenLast = thenResult.last;
        thenPending = thenResult.pendingConnections || [];
      }
      
      // Process else branch
      const elseInfo = (languageConfig.extractElseBranch && languageConfig.extractElseBranch(call)) || { calls: [] };
      const elseCalls = Array.isArray(elseInfo?.calls) ? elseInfo.calls : [];
      let elseLast = condId;
      let elsePending = [];
      
      if (elseCalls.length > 0) {
        const elseResult = processBranchStatements(elseCalls, flow, languageConfig, elseLast);
        elseLast = elseResult.last;
        elsePending = elseResult.pendingConnections || [];
      }
      
      // Collect pending connections from both branches
      pendingConnections.push(...thenPending, ...elsePending);
      
      // Add the end nodes of both branches as pending connections to the next statement
      pendingConnections.push({ from: thenLast, type: 'next' });
      pendingConnections.push({ from: elseLast, type: 'next' });
      
      // For nested conditionals, we don't update currentLast because the connections are handled via pending connections
      currentLast = condId;
    } else if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
      const outputInfo = languageConfig.extractOutputInfo ? languageConfig.extractOutputInfo(call) : null;
      if (outputInfo) {
        const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
        const outputId = flow.addInputOutput(call, label);
        flow.link(currentLast, outputId);
        currentLast = outputId;
      }
    } else if (languageConfig.isAssignment && languageConfig.isAssignment(call)) {
      const varInfo = languageConfig.extractVariableInfo ? languageConfig.extractVariableInfo(call) : null;
      if (varInfo && (varInfo.name || varInfo.value)) {
        const label = `${varInfo.name ?? ''} = ${varInfo.value ?? ''}`.trim();
        const assignId = flow.addAction(call, label);
        flow.link(currentLast, assignId);
        currentLast = assignId;
      }
    }
  }
  
  return { last: currentLast, pendingConnections };
}

/**
 * Process if/else if statement chains and generate proper flowchart connections
 * This function handles the complete chain of if-else if-else statements
 * ensuring each conditional node has exactly two output connections
 * 
 * @param {Array} nodes - Array of AST nodes to process
 * @param {Object} flow - Flow builder instance
 * @param {Object} languageConfig - Language-specific configuration
 * @param {string} last - ID of the last node to connect from
 * @param {Array} pendingConnections - Pending connections to handle
 * @returns {Object} Result with last node ID and pending connections
 */
export function processConditionalChain(nodes, flow, languageConfig, last, pendingConnections) {
  if (!nodes || nodes.length === 0) {
    return { last, pendingConnections };
  }
  
  // Process the first if statement
  const firstNode = nodes[0];
  if (!firstNode || !languageConfig.isConditional(firstNode)) {
    return { last, pendingConnections };
  }
  
  // Extract condition info for the first if statement
  const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(firstNode)) || { text: 'condition' };
  const conditionalText = condInfo.text || 'condition';
  
  // Create the first if statement node
  const ifId = flow.addIfStatement(firstNode, `if ${conditionalText}?`);
  flow.link(last, ifId);
  
  // Process the then branch of the first if statement
  const thenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(firstNode)) || { calls: [] };
  const thenCalls = Array.isArray(thenInfo?.calls) ? thenInfo.calls : [];
  let thenLast = ifId;
  let allPendingConnections = [];
  let thenEndNodes = [];
  
  if (thenCalls.length > 0) {
    // Recursively process statements in the then branch
    const thenResult = processBranchStatements(thenCalls, flow, languageConfig, thenLast);
    thenLast = thenResult.last;
    allPendingConnections.push(...(thenResult.pendingConnections || []));
    
    // Collect end nodes from pending connections that were added by nested conditionals
    const thenPendingNext = (thenResult.pendingConnections || []).filter(conn => conn && conn.type === 'next');
    if (thenPendingNext.length > 0) {
      thenEndNodes = thenPendingNext.map(conn => conn.from);
    } else {
      // If no nested conditionals, use the last node
      thenEndNodes = [thenLast];
    }
  } else {
    // If no calls, use the conditional node itself
    thenEndNodes = [thenLast];
  }
  
  // Track nodes that need to connect to the next statement
  let chainEndNodes = [...thenEndNodes];
  let previousCondId = ifId;
  
  // Process remaining elif/else statements
  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    
    // Check if this is an elif clause (nested if statement)
    if (node.type === 'if_statement') {
      // Extract condition info
      const elifCondInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(node)) || { text: 'condition' };
      const elifConditionalText = elifCondInfo.text || 'condition';
      
      // Create elif node
      const elifId = flow.addElseIfStatement(node, `else if ${elifConditionalText}?`);
      flow.link(previousCondId, elifId, 'no');
      
      // Process then branch of elif
      const elifThenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(node)) || { calls: [] };
      const elifThenCalls = Array.isArray(elifThenInfo?.calls) ? elifThenInfo.calls : [];
      let elifThenLast = elifId;
      let elifThenPending = [];
      let elifThenEndNodes = [];
      
      if (elifThenCalls.length > 0) {
        // Recursively process statements in the elif then branch
        const elifThenResult = processBranchStatements(elifThenCalls, flow, languageConfig, elifThenLast);
        elifThenLast = elifThenResult.last;
        elifThenPending = elifThenResult.pendingConnections || [];
        allPendingConnections.push(...elifThenPending);
        
        // Collect end nodes from pending connections that were added by nested conditionals
        const elifThenPendingNext = (elifThenResult.pendingConnections || []).filter(conn => conn && conn.type === 'next');
        if (elifThenPendingNext.length > 0) {
          elifThenEndNodes = elifThenPendingNext.map(conn => conn.from);
        } else {
          // If no nested conditionals, use the last node
          elifThenEndNodes = [elifThenLast];
        }
      } else {
        // If no calls, use the conditional node itself
        elifThenEndNodes = [elifThenLast];
      }
      
      // Add to chain end nodes
      chainEndNodes.push(...elifThenEndNodes);
      
      previousCondId = elifId;
    } else if (node.type === 'else_clause') {
      // Handle else clause - process statements within the else block
      const elseInfo = { calls: node.children || [] };
      const elseCalls = Array.isArray(elseInfo?.calls) ? elseInfo.calls : [];
      let elseLast = previousCondId;
      let elsePending = [];
      let elseEndNodes = [];
      
      if (elseCalls.length > 0) {
        // Recursively process statements in the else branch
        const elseResult = processBranchStatements(elseCalls, flow, languageConfig, elseLast);
        elseLast = elseResult.last;
        elsePending = elseResult.pendingConnections || [];
        allPendingConnections.push(...elsePending);
        
        // Collect end nodes from pending connections that were added by nested conditionals
        const elsePendingNext = (elseResult.pendingConnections || []).filter(conn => conn && conn.type === 'next');
        if (elsePendingNext.length > 0) {
          elseEndNodes = elsePendingNext.map(conn => conn.from);
        } else {
          // If no nested conditionals, use the last node
          elseEndNodes = [elseLast];
        }
      } else {
        // If no calls, use the conditional node itself
        elseEndNodes = [elseLast];
      }
      
      // Add to chain end nodes
      chainEndNodes.push(...elseEndNodes);
    }
  }
  
  // Add all chain end nodes as pending connections to the next statement
  for (const nodeId of chainEndNodes) {
    allPendingConnections.push({ from: nodeId, type: 'next' });
  }
  
  // Also connect the final condition's 'no' path to the next statement
  allPendingConnections.push({ from: previousCondId, label: 'no', type: 'next' });
  
  return { last: previousCondId, pendingConnections: allPendingConnections };
}

/**
 * Process a single conditional statement with proper branching
 * 
 * @param {Object} node - AST node representing the conditional statement
 * @param {Object} flow - Flow builder instance
 * @param {Object} languageConfig - Language-specific configuration
 * @param {string} last - ID of the last node to connect from
 * @returns {Object} Result with last node ID and pending connections
 */
export function processSingleConditional(node, flow, languageConfig, last) {
  if (!node || !languageConfig.isConditional(node)) {
    return { last, pendingConnections: [] };
  }
  
  // Extract condition info
  const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(node)) || { text: 'condition' };
  const conditionalText = condInfo.text || 'condition';
  
  // Determine if this is an else if statement
  let isElseIf = false;
  if (node.type === 'elif_clause') {
    isElseIf = true;
  }
  
  // Create the conditional node
  let condId;
  if (isElseIf) {
    condId = flow.addElseIfStatement(node, `else if ${conditionalText}?`);
  } else {
    condId = flow.addIfStatement(node, `if ${conditionalText}?`);
  }
  
  flow.link(last, condId);
  
  // Process then branch
  const thenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(node)) || { calls: [] };
  const thenCalls = Array.isArray(thenInfo?.calls) ? thenInfo.calls : [];
  let thenLast = condId;
  let thenPending = [];
  
  if (thenCalls.length > 0) {
    // Recursively process statements in the then branch
    const thenResult = processBranchStatements(thenCalls, flow, languageConfig, thenLast);
    thenLast = thenResult.last;
    thenPending = thenResult.pendingConnections || [];
  }
  
  // Process else branch
  const elseInfo = (languageConfig.extractElseBranch && languageConfig.extractElseBranch(node)) || { calls: [] };
  const elseCalls = Array.isArray(elseInfo?.calls) ? elseInfo.calls : [];
  let elseLast = condId;
  let elsePending = [];
  
  if (elseCalls.length > 0) {
    // Recursively process statements in the else branch
    const elseResult = processBranchStatements(elseCalls, flow, languageConfig, elseLast);
    elseLast = elseResult.last;
    elsePending = elseResult.pendingConnections || [];
  }
  
  // Collect all pending connections from both branches
  const allPendingConnections = [...thenPending, ...elsePending];
  
  // Add the end nodes of both branches as pending connections to the next statement
  allPendingConnections.push({ from: thenLast, type: 'next' });
  allPendingConnections.push({ from: elseLast, type: 'next' });
  
  // Return the conditional node as the merge point, along with pending connections
  return { last: condId, pendingConnections: allPendingConnections };
}