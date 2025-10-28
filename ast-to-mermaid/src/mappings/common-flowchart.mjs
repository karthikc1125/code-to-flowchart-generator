import { createFlowBuilder } from './_common.mjs';

// Utility function to get text from a node
function textOf(node) { 
  return node?.text || ''; 
}

// Utility function to find all nodes of a specific type
function findAll(node, type) {
  const results = [];
  if (!node) return results;
  if (node.type === type) results.push(node);
  for (const c of node.children || []) {
    results.push(...findAll(c, type));
  }
  return results;
}

// Utility function to recursively process a list of statements
function processStatements(statements, flow, languageConfig, last, pendingConnections) {
  let currentLast = last;
  const localPendingConnections = [];
  
  for (const stmt of statements) {
    if (!stmt) continue;
    
    // Handle output operations
    if (languageConfig.isOutputCall && languageConfig.isOutputCall(stmt)) {
      const outputInfo = languageConfig.extractOutputInfo(stmt);
      if (outputInfo) {
        const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
        const outputId = flow.addInputOutput(stmt, label);
        flow.link(currentLast, outputId);
        currentLast = outputId;
      }
      continue;
    }
    
    // Handle generic function calls (not input/output)
    if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(stmt)) {
      const callInfo = languageConfig.extractFunctionCallInfo(stmt);
      if (callInfo && callInfo.name) {
        const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
        const callId = flow.addAction(stmt, label);
        flow.link(currentLast, callId);
        currentLast = callId;
      }
      continue;
    }
    
    // Handle expression statements that contain function calls
    if (stmt.type === 'expression_statement' && stmt.children) {
      const callExpr = stmt.children.find(c => c && (c.type === 'call_expression' || c.type === 'method_invocation'));
      if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
        const callInfo = languageConfig.extractFunctionCallInfo(callExpr);
        if (callInfo && callInfo.name) {
          const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
          const callId = flow.addAction(callExpr, label);
          flow.link(currentLast, callId);
          currentLast = callId;
        }
      }
      continue;
    }
    
    // Handle conditional statements (recursively)
    if (languageConfig.isConditional && languageConfig.isConditional(stmt)) {
      const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(stmt)) || { text: 'condition' };
      
      // Determine if this is an else if statement by checking the context
      let isElseIf = false;
      let conditionalText = condInfo.text || 'condition';
      
      // Use different shapes for different conditional types
      let condId;
      if (stmt.type === 'if_statement' || stmt.type === 'elif_clause') {
        const labelPrefix = isElseIf ? 'else if' : 'if';
        condId = isElseIf 
          ? flow.addElseIfStatement(stmt, `${labelPrefix} ${conditionalText}?`)
          : flow.addIfStatement(stmt, `${labelPrefix} ${conditionalText}?`);
      } else if (stmt.type === 'switch_statement' || stmt.type === 'switch_expression') {
        condId = flow.addSwitchStatement(stmt, `${conditionalText}?`);
      } else {
        condId = flow.addDecision(stmt, `${conditionalText}?`);
      }
      
      flow.link(currentLast, condId);
      
      // Process then branch
      const thenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(stmt)) || { calls: [] };
      const thenCalls = Array.isArray(thenInfo?.calls) ? thenInfo.calls : [];
      
      let thenLast = condId;
      if (thenCalls.length > 0) {
        const thenResult = processStatements(thenCalls, flow, languageConfig, thenLast, []);
        thenLast = thenResult.last;
      }
      
      // Process else branch
      const elseInfo = (languageConfig.extractElseBranch && languageConfig.extractElseBranch(stmt)) || { calls: [] };
      const elseCalls = Array.isArray(elseInfo?.calls) ? elseInfo.calls : [];
      
      let elseLast = condId;
      if (elseCalls.length > 0) {
        const elseResult = processStatements(elseCalls, flow, languageConfig, elseLast, []);
        elseLast = elseResult.last;
      }
      
      // For nested conditionals, we need to determine the next node
      // For now, we'll set currentLast to the condition node itself
      currentLast = condId;
      continue;
    }
    
    // Handle loop statements (recursively)
    if (languageConfig.isLoop && languageConfig.isLoop(stmt)) {
      const loopInfo = (languageConfig.extractLoopInfo && languageConfig.extractLoopInfo(stmt)) || { type: 'loop', condition: 'condition', calls: [] };
      
      if (stmt.type === 'do_statement') {
        // Handle do-while loops with correct structure
        const doId = flow.addAction(stmt, 'do');
        flow.link(currentLast, doId);
        
        // Process loop body
        const loopCalls = Array.isArray(loopInfo?.calls) ? loopInfo.calls : [];
        let bodyLast = doId;
        
        if (loopCalls.length > 0) {
          const bodyResult = processStatements(loopCalls, flow, languageConfig, bodyLast, []);
          bodyLast = bodyResult.last;
        }
        
        // Add "while" condition as diamond
        const whileId = flow.addLoopStatement(`${stmt.text}_while`, `while : ${loopInfo.condition || 'condition'}`);
        flow.link(bodyLast, whileId);
        
        // Loop back to "do" statement
        flow.link(whileId, doId, 'yes');
        
        currentLast = whileId;
      } else {
        // Handle regular loops (for, while)
        const loopId = flow.addLoopStatement(stmt, `${loopInfo.type || 'loop'}: ${loopInfo.condition || 'condition'}`);
        flow.link(currentLast, loopId);
        
        // Process loop body
        const loopCalls = Array.isArray(loopInfo?.calls) ? loopInfo.calls : [];
        let bodyLast = loopId;
        
        if (loopCalls.length > 0) {
          const bodyResult = processStatements(loopCalls, flow, languageConfig, bodyLast, []);
          bodyLast = bodyResult.last;
        }
        
        // Loop back to condition
        flow.link(bodyLast, loopId);
        
        currentLast = loopId;
      }
      continue;
    }
    
    // Handle assignments
    if (languageConfig.isAssignment && languageConfig.isAssignment(stmt)) {
      const varInfo = languageConfig.extractVariableInfo(stmt);
      if (varInfo && (varInfo.name || varInfo.value)) {
        const label = `${varInfo.name ?? ''} = ${varInfo.value ?? ''}`.trim();
        const assignId = flow.addAction(stmt, label);
        flow.link(currentLast, assignId);
        currentLast = assignId;
      }
      continue;
    }
    
    // Handle return statements
    if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(stmt)) {
      const returnInfo = languageConfig.extractReturnInfo(stmt);
      const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
      const returnId = flow.addReturnStatement(stmt, label);
      flow.link(currentLast, returnId);
      currentLast = returnId;
      continue;
    }
    
    // Handle break statements
    if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(stmt)) {
      const breakId = flow.addBreakStatement(stmt, 'break');
      flow.link(currentLast, breakId);
      currentLast = breakId;
      continue;
    }
    
    // Handle continue statements
    if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(stmt)) {
      const continueId = flow.addContinueStatement(stmt, 'continue');
      flow.link(currentLast, continueId);
      currentLast = continueId;
      continue;
    }
  }
  
  return { last: currentLast, pendingConnections: localPendingConnections };
}

// Common flowchart generation logic that works for any language
export function generateCommonFlowchart(nodes, languageConfig) {
  try {
    const flow = createFlowBuilder();
    const start = flow.addStart();
    let last = start;
    const pendingConnections = []; // Track nodes that need to connect to the next statement

    // Find the root node (program, module, etc.)
    // nodes may be a generator; normalize to an array first
    const nodeList = Array.isArray(nodes) ? nodes : Array.from(nodes || []);
    const rootNode = nodeList.find(n => n && languageConfig.rootNodeTypes.includes(n.type));
    if (!rootNode || !rootNode.children) {
      const end = flow.addEnd();
      flow.link(start, end);
      return flow.toString();
    }

    // First, process user-defined functions and create subgraphs for them
    const functionNodes = nodeList.filter(n => languageConfig.isFunctionDefinition && languageConfig.isFunctionDefinition(n));
    for (const funcNode of functionNodes) {
      const funcName = languageConfig.extractFunctionName ? languageConfig.extractFunctionName(funcNode) : 'function';
      const subgraphId = flow.beginSubgraph(funcNode, `Function: ${funcName}`);
      
      // Process the function body
      const funcBody = funcNode.children.find(c => c && (c.type === 'statement_block' || c.type === 'compound_statement' || c.type === 'block'));
      if (funcBody && funcBody.children) {
        const funcStatements = funcBody.children;
        for (const stmt of funcStatements) {
          // Process each statement in the function
          // This is a simplified approach - in reality, we'd need to recursively process
          if (stmt.type === 'return_statement') {
            const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(stmt) : { value: '' };
            const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
            flow.addReturnStatement(stmt, label);
          } else if (stmt.type === 'expression_statement') {
            // Handle expression statements (like function calls)
            flow.addAction(stmt, 'function call');
          } else if (stmt.type === 'call_expression' || stmt.type === 'call') {
            // Handle direct call expressions
            const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(stmt) : null;
            if (callInfo && callInfo.name) {
              const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
              flow.addAction(stmt, label);
            } else {
              flow.addAction(stmt, 'function call');
            }
          }
        }
      }
      
      flow.endSubgraph();
    }

    // Determine which nodes to process. Allow language to provide a focused list (e.g., main method body)
    const candidateNodesRaw = typeof languageConfig.findStatementNodes === 'function'
      ? (languageConfig.findStatementNodes(rootNode) || [])
      : (rootNode.children || []);
    const candidateNodes = Array.isArray(candidateNodesRaw) ? candidateNodesRaw : Array.from(candidateNodesRaw || []);

    const processedNodes = new Set();
    
    for (const node of candidateNodes) {
      if (!node) continue;
      if (processedNodes.has(node)) continue;
      
      try {
        // Handle pending connections from previous statements that connect to the next statement
        // This includes loop exits, break statements, continue statements, etc.
        const nextConnections = pendingConnections.filter(conn => conn && conn.type === 'next');
        const endConnections = pendingConnections.filter(conn => conn && conn.type === 'end');
        
        // Clear the pending connections array for this iteration
        pendingConnections.length = 0;
        
        // Add back the end connections for later processing
        pendingConnections.push(...endConnections);
        
        // Handle input operations FIRST (before assignments)
        if (languageConfig.isInputCall && languageConfig.isInputCall(node)) {
          const inputInfo = languageConfig.extractInputInfo ? languageConfig.extractInputInfo(node) : { prompt: '' };
          const label = inputInfo && inputInfo.prompt ? `read input: ${inputInfo.prompt}` : 'read input';
          const inputId = flow.addInputOutput(node, label);
          
          // Make connections to this statement
          if (nextConnections.length > 0) {
            for (const conn of nextConnections) {
              flow.link(conn.from, inputId, conn.label);
            }
          } else {
            flow.link(last, inputId);
          }
          
          last = inputId;
          processedNodes.add(node);
          continue;
        }
      
        // Handle variable declarations and assignments
        if (languageConfig.isAssignment && languageConfig.isAssignment(node)) {
          const varInfo = languageConfig.extractVariableInfo ? languageConfig.extractVariableInfo(node) : null;
          if (varInfo && (varInfo.name || varInfo.value)) {
            const label = `${varInfo.name ?? ''} = ${varInfo.value ?? ''}`.trim();
            const assignId = flow.addAction(node, label);
            
            // Make connections to this statement
            if (nextConnections.length > 0) {
              for (const conn of nextConnections) {
                flow.link(conn.from, assignId, conn.label);
              }
            } else {
              flow.link(last, assignId);
            }
            
            last = assignId;
            processedNodes.add(node);
            continue;
          }
        }
      
        // Handle break statements
        if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(node)) {
          const breakId = flow.addBreakStatement(node, 'break');
          if (nextConnections.length > 0) {
            for (const conn of nextConnections) {
              flow.link(conn.from, breakId, conn.label);
            }
          } else {
            flow.link(last, breakId);
          }
          // Break statements connect to the next statement (after the loop)
          pendingConnections.push({ from: breakId, label: undefined, type: 'next' });
          processedNodes.add(node);
          continue;
        }
        
        // Handle continue statements
        if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(node)) {
          const continueId = flow.addContinueStatement(node, 'continue');
          if (nextConnections.length > 0) {
            for (const conn of nextConnections) {
              flow.link(conn.from, continueId, conn.label);
            }
          } else {
            flow.link(last, continueId);
          }
          // Continue statements loop back to the condition
          // We'll handle this properly in the loop processing section
          pendingConnections.push({ from: continueId, label: undefined, type: 'next' });
          processedNodes.add(node);
          continue;
        }
        
        // Handle return statements
        if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(node)) {
          const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(node) : { value: '' };
          const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
          const returnId = flow.addReturnStatement(node, label);
          if (nextConnections.length > 0) {
            for (const conn of nextConnections) {
              flow.link(conn.from, returnId, conn.label);
            }
          } else {
            flow.link(last, returnId);
          }
          // Update last to point to the return statement
          last = returnId;
          // Don't connect return statements directly to end when they're part of normal flow
          // They will be connected via the normal flow logic at the end
          processedNodes.add(node);
          continue;
        }
        
        // Handle conditional statements
        if (languageConfig.isConditional && languageConfig.isConditional(node)) {
          // Special handling for switch statements
          if (node.type === 'switch_statement' || node.type === 'match_statement' || node.type === 'switch_expression') {
            // Handle switch statements specially - process the body directly
            const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(node)) || { text: 'condition' };
            const switchId = flow.addSwitchStatement(node, `${condInfo.text || 'condition'}?`);
            flow.link(last, switchId);
            
            // Process switch statement children directly to handle cases, breaks, etc.
            // Handle different language structures for switch statements
            if (node.children) {
              // Track case nodes for linking
              const caseNodes = [];
              
              // Determine the switch body based on language
              let switchBody = null;
              
              // Java switch_expression has switch_block
              if (node.type === 'switch_expression') {
                switchBody = node.children.find(c => c && c.type === 'switch_block');
              } 
              // JavaScript switch_statement has switch_body
              else if (node.type === 'switch_statement') {
                switchBody = node.children.find(c => c && c.type === 'switch_body');
              }
              // Python match_statement has block
              else if (node.type === 'match_statement') {
                switchBody = node.children.find(c => c && c.type === 'block');
              }
              // C/C++ switch_statement has compound_statement
              else {
                switchBody = node.children.find(c => c && c.type === 'compound_statement');
              }
              
              if (switchBody && switchBody.children) {
                // Process each case based on language structure
                if (node.type === 'switch_expression') {
                  // Java structure - switch_block with switch_block_statement_group
                  for (const group of switchBody.children) {
                    if (!group || group.type !== 'switch_block_statement_group') continue;
                    
                    // Find the switch_label within the group
                    const switchLabel = group.children.find(c => c && c.type === 'switch_label');
                    if (!switchLabel) continue;
                    
                    // Determine case label
                    let caseLabel = 'case';
                    if (switchLabel.children) {
                      const defaultKeyword = switchLabel.children.find(c => c && c.type === 'default');
                      if (defaultKeyword) {
                        caseLabel = 'default';
                      } else {
                        // Find case value
                        const caseKeyword = switchLabel.children.find(c => c && c.type === 'case');
                        if (caseKeyword) {
                          // Look for the value after 'case'
                          for (let i = 0; i < switchLabel.children.length; i++) {
                            if (switchLabel.children[i] === caseKeyword && i + 1 < switchLabel.children.length) {
                              const valueNode = switchLabel.children[i + 1];
                              if (valueNode && (valueNode.type === 'decimal_integer_literal' || 
                                                valueNode.type === 'string_literal' || 
                                                valueNode.type === 'identifier')) {
                                caseLabel = `case ${textOf(valueNode)}`;
                                break;
                              }
                            }
                          }
                        }
                      }
                    }
                    
                    // Add case node with rectangle shape
                    const caseId = flow.addCaseStatement(group, caseLabel);
                    flow.link(switchId, caseId);
                    caseNodes.push(caseId);
                    
                    // Process statements within this case
                    let caseLast = caseId;
                    let caseEnded = false;
                    
                    // Process statements after the switch_label
                    let statementsStarted = false;
                    for (const stmt of group.children) {
                      if (!stmt) continue;
                      
                      // Start processing after the switch_label
                      if (stmt.type === 'switch_label') {
                        statementsStarted = true;
                        continue;
                      }
                      if (!statementsStarted) continue;
                      if (caseEnded) continue;
                      
                      // Handle break statements
                      if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(stmt)) {
                        const breakId = flow.addBreakStatement(stmt, 'break');
                        flow.link(caseLast, breakId);
                        caseLast = breakId;
                        caseEnded = true;
                        continue;
                      }
                      
                      // Handle continue statements
                      if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(stmt)) {
                        const continueId = flow.addContinueStatement(stmt, 'continue');
                        flow.link(caseLast, continueId);
                        caseLast = continueId;
                        continue;
                      }
                      
                      // Handle return statements
                      if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(stmt)) {
                        const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(stmt) : { value: '' };
                        const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
                        const returnId = flow.addReturnStatement(stmt, label);
                        flow.link(caseLast, returnId);
                        caseLast = returnId;
                        caseEnded = true;
                        continue;
                      }
                      
                      // Handle output calls
                      if (languageConfig.isOutputCall && languageConfig.isOutputCall(stmt)) {
                        const outputInfo = languageConfig.extractOutputInfo(stmt);
                        if (outputInfo) {
                          const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                          const outputId = flow.addInputOutput(stmt, label);
                          flow.link(caseLast, outputId);
                          caseLast = outputId;
                        }
                        continue;
                      }
                      
                      // Handle other function calls
                      if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(stmt)) {
                        const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(stmt) : null;
                        if (callInfo && callInfo.name) {
                          const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                          const callId = flow.addAction(stmt, label);
                          flow.link(caseLast, callId);
                          caseLast = callId;
                        }
                        continue;
                      }
                      
                      // Handle expression statements (like System.out.println calls)
                      if (stmt.type === 'expression_statement') {
                        // Check if this is a function call
                        if (stmt.children) {
                          const callExpr = stmt.children.find(c => c && (c.type === 'method_invocation' || c.type === 'call_expression'));
                          if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
                            const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(callExpr) : null;
                            if (callInfo && callInfo.name) {
                              const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                              const callId = flow.addAction(callExpr, label);
                              flow.link(caseLast, callId);
                              caseLast = callId;
                            }
                          }
                        }
                        continue;
                      }
                    }
                    
                    // Connect case to next statement
                    pendingConnections.push(caseLast);
                  }
                } else if (node.type === 'switch_statement') {
                  // JavaScript structure - switch_body with switch_case/switch_default
                  for (const caseNode of switchBody.children) {
                    if (!caseNode || (caseNode.type !== 'switch_case' && caseNode.type !== 'switch_default')) continue;
                    
                    // Determine case label
                    let caseLabel = 'case';
                    if (caseNode.type === 'switch_default') {
                      caseLabel = 'default';
                    } else if (caseNode.children) {
                      // Find case keyword and value
                      const caseKeyword = caseNode.children.find(c => c && c.type === 'case');
                      if (caseKeyword) {
                        // Look for the value after 'case'
                        for (let i = 0; i < caseNode.children.length; i++) {
                          if (caseNode.children[i] === caseKeyword && i + 1 < caseNode.children.length) {
                            const valueNode = caseNode.children[i + 1];
                            if (valueNode && (valueNode.type === 'number' || 
                                              valueNode.type === 'string' || 
                                              valueNode.type === 'identifier')) {
                              caseLabel = `case ${textOf(valueNode)}`;
                              break;
                            }
                          }
                        }
                      }
                    }
                    
                    // Add case node with rectangle shape
                    const caseId = flow.addCaseStatement(caseNode, caseLabel);
                    flow.link(switchId, caseId);
                    caseNodes.push(caseId);
                    
                    // Process statements within this case
                    let caseLast = caseId;
                    let caseEnded = false;
                    
                    // Process statements after the case label and colon
                    let statementsStarted = false;
                    for (const stmt of caseNode.children) {
                      if (!stmt) continue;
                      
                      // Start processing after case label and colon
                      if (stmt.type === 'case' || stmt.type === 'default') {
                        statementsStarted = true;
                        continue;
                      }
                      if (stmt.type === ':' && !statementsStarted) {
                        statementsStarted = true;
                        continue;
                      }
                      if (!statementsStarted) continue;
                      if (caseEnded) continue;
                      
                      // Handle break statements
                      if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(stmt)) {
                        const breakId = flow.addBreakStatement(stmt, 'break');
                        flow.link(caseLast, breakId);
                        caseLast = breakId;
                        caseEnded = true;
                        continue;
                      }
                      
                      // Handle continue statements
                      if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(stmt)) {
                        const continueId = flow.addContinueStatement(stmt, 'continue');
                        flow.link(caseLast, continueId);
                        caseLast = continueId;
                        continue;
                      }
                      
                      // Handle return statements
                      if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(stmt)) {
                        const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(stmt) : { value: '' };
                        const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
                        const returnId = flow.addReturnStatement(stmt, label);
                        flow.link(caseLast, returnId);
                        caseLast = returnId;
                        caseEnded = true;
                        continue;
                      }
                      
                      // Handle output calls
                      if (languageConfig.isOutputCall && languageConfig.isOutputCall(stmt)) {
                        const outputInfo = languageConfig.extractOutputInfo(stmt);
                        if (outputInfo) {
                          const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                          const outputId = flow.addInputOutput(stmt, label);
                          flow.link(caseLast, outputId);
                          caseLast = outputId;
                        }
                        continue;
                      }
                      
                      // Handle other function calls
                      if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(stmt)) {
                        const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(stmt) : null;
                        if (callInfo && callInfo.name) {
                          const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                          const callId = flow.addAction(stmt, label);
                          flow.link(caseLast, callId);
                          caseLast = callId;
                        }
                        continue;
                      }
                      
                      // Handle expression statements (like console.log calls)
                      if (stmt.type === 'expression_statement') {
                        // Check if this is a function call
                        if (stmt.children) {
                          const callExpr = stmt.children.find(c => c && c.type === 'call_expression');
                          if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
                            const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(callExpr) : null;
                            if (callInfo && callInfo.name) {
                              const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                              const callId = flow.addAction(callExpr, label);
                              flow.link(caseLast, callId);
                              caseLast = callId;
                            }
                          }
                        }
                        continue;
                      }
                    }
                    
                    // Connect case to next statement
                    pendingConnections.push(caseLast);
                  }
                } else if (node.type === 'match_statement') {
                  // Python structure - block with case_clause
                  for (const caseNode of switchBody.children) {
                    if (!caseNode || caseNode.type !== 'case_clause') continue;
                    
                    // Determine case label
                    let caseLabel = 'case';
                    if (caseNode.children) {
                      // Find case keyword and pattern
                      const caseKeyword = caseNode.children.find(c => c && c.type === 'case');
                      if (caseKeyword) {
                        // Look for the pattern after 'case'
                        for (let i = 0; i < caseNode.children.length; i++) {
                          if (caseNode.children[i] === caseKeyword && i + 1 < caseNode.children.length) {
                            const patternNode = caseNode.children[i + 1];
                            if (patternNode && patternNode.type === 'case_pattern') {
                              // Get the value from case_pattern
                              if (patternNode.children && patternNode.children.length > 0) {
                                const valueNode = patternNode.children[0];
                                if (valueNode) {
                                  if (valueNode.type === '_') {
                                    caseLabel = 'default';
                                  } else {
                                    caseLabel = `case ${textOf(valueNode)}`;
                                  }
                                  break;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    
                    // Add case node with rectangle shape
                    const caseId = flow.addCaseStatement(caseNode, caseLabel);
                    flow.link(switchId, caseId);
                    caseNodes.push(caseId);
                    
                    // Process statements within this case
                    let caseLast = caseId;
                    
                    // Find the block within the case_clause
                    const caseBlock = caseNode.children.find(c => c && c.type === 'block');
                    if (caseBlock && caseBlock.children) {
                      for (const stmt of caseBlock.children) {
                        if (!stmt) continue;
                        
                        // Handle output calls
                        if (languageConfig.isOutputCall && languageConfig.isOutputCall(stmt)) {
                          const outputInfo = languageConfig.extractOutputInfo(stmt);
                          if (outputInfo) {
                            const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                            const outputId = flow.addInputOutput(stmt, label);
                            flow.link(caseLast, outputId);
                            caseLast = outputId;
                          }
                          continue;
                        }
                        
                        // Handle other function calls
                        if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(stmt)) {
                          const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(stmt) : null;
                          if (callInfo && callInfo.name) {
                            const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                            const callId = flow.addAction(stmt, label);
                            flow.link(caseLast, callId);
                            caseLast = callId;
                          }
                          continue;
                        }
                        
                        // Handle expression statements (like print calls)
                        if (stmt.type === 'expression_statement') {
                          // Check if this is a function call
                          if (stmt.children) {
                            const callExpr = stmt.children.find(c => c && c.type === 'call');
                            if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
                              const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(callExpr) : null;
                              if (callInfo && callInfo.name) {
                                const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                                const callId = flow.addAction(callExpr, label);
                                flow.link(caseLast, callId);
                                caseLast = callId;
                              }
                            }
                          }
                          continue;
                        }
                      }
                    }
                    
                    // Connect case to next statement
                    pendingConnections.push(caseLast);
                  }
                } else {
                  // C/C++ structure - compound_statement with case_statement
                  for (const child of switchBody.children) {
                    if (!child) continue;
                    
                    // Handle case statements
                    if (child.type === 'case_statement') {
                      // Extract case value
                      let caseLabel = 'case';
                      
                      // Look for the case value and colon
                      let caseValue = null;
                      let statementsStartIndex = 0;
                      
                      // Find the case value and colon
                      for (let i = 0; i < child.children.length; i++) {
                        const c = child.children[i];
                        if (!c) continue;
                        
                        // Found case keyword
                        if (c.type === 'case') {
                          // Next non-null child should be the value
                          for (let j = i + 1; j < child.children.length; j++) {
                            const next = child.children[j];
                            if (next && (next.type === 'number_literal' || next.type === 'identifier' || next.type === 'string_literal')) {
                              caseValue = next;
                              caseLabel = `case ${textOf(caseValue)}`;
                              // Find the colon after the value
                              for (let k = j + 1; k < child.children.length; k++) {
                                if (child.children[k] && child.children[k].type === ':') {
                                  statementsStartIndex = k + 1;
                                  break;
                                }
                              }
                              break;
                            }
                          }
                          break;
                        } else if (c.type === 'default') {
                          caseLabel = 'default';
                          // Find the colon after default
                          for (let j = i + 1; j < child.children.length; j++) {
                            if (child.children[j] && child.children[j].type === ':') {
                              statementsStartIndex = j + 1;
                              break;
                            }
                          }
                          break;
                        }
                      }
                      
                      // Add case node with rectangle shape
                      const caseId = flow.addCaseStatement(child, caseLabel);
                      flow.link(switchId, caseId);
                      caseNodes.push(caseId);
                      
                      // Process statements within this case
                      let caseLast = caseId;
                      let caseEnded = false;
                      
                      // Process statements from statementsStartIndex onwards
                      for (let i = statementsStartIndex; i < child.children.length; i++) {
                        const stmt = child.children[i];
                        if (!stmt || caseEnded) continue;
                        
                        // Handle break statements
                        if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(stmt)) {
                          const breakId = flow.addBreakStatement(stmt, 'break');
                          flow.link(caseLast, breakId);
                          caseLast = breakId;
                          caseEnded = true;
                          continue;
                        }
                        
                        // Handle continue statements
                        if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(stmt)) {
                          const continueId = flow.addContinueStatement(stmt, 'continue');
                          flow.link(caseLast, continueId);
                          caseLast = continueId;
                          continue;
                        }
                        
                        // Handle return statements
                        if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(stmt)) {
                          const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(stmt) : { value: '' };
                          const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
                          const returnId = flow.addReturnStatement(stmt, label);
                          flow.link(caseLast, returnId);
                          caseLast = returnId;
                          caseEnded = true;
                          continue;
                        }
                        
                        // Handle output calls
                        if (languageConfig.isOutputCall && languageConfig.isOutputCall(stmt)) {
                          const outputInfo = languageConfig.extractOutputInfo(stmt);
                          if (outputInfo) {
                            const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                            const outputId = flow.addInputOutput(stmt, label);
                            flow.link(caseLast, outputId);
                            caseLast = outputId;
                          }
                          continue;
                        }
                        
                        // Handle other function calls
                        if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(stmt)) {
                          const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(stmt) : null;
                          if (callInfo && callInfo.name) {
                            const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                            const callId = flow.addAction(stmt, label);
                            flow.link(caseLast, callId);
                            caseLast = callId;
                          }
                          continue;
                        }
                        
                        // Handle expression statements (like printf calls)
                        if (stmt.type === 'expression_statement') {
                          // Check if this is a function call
                          if (stmt.children) {
                            const callExpr = stmt.children.find(c => c && c.type === 'call_expression');
                            if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
                              const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(callExpr) : null;
                              if (callInfo && callInfo.name) {
                                const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
                                const callId = flow.addAction(callExpr, label);
                                flow.link(caseLast, callId);
                                caseLast = callId;
                              }
                            }
                          }
                          continue;
                        }
                      }
                      
                      // Connect case to next statement
                      pendingConnections.push(caseLast);
                    }
                  }
                }
              }
            }
            
            // For switch statements, we don't update 'last' because switches don't have a single end point
            // All cases will connect to the next statement through pendingConnections
            processedNodes.add(node);
            continue;
          }
          
          // Handle regular if/else statements with full recursive processing
          const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(node)) || { text: 'condition' };
          
          // Determine if this is an else if statement by checking the context
          let isElseIf = false;
          let conditionalText = condInfo.text || 'condition';
          
          // Check if this is part of an else if chain
          // For different languages, we need different approaches:
          
          // For Python, check if this is an elif_clause
          if (node.type === 'elif_clause') {
            isElseIf = true;
            conditionalText = `else if ${conditionalText}`;
          } 
          // For C/C++/Java/JavaScript, check the parent structure
          else if (node.parent && node.parent.type === 'else_clause') {
            // This is nested inside an else clause, so it's an else if
            isElseIf = true;
            conditionalText = `else if ${conditionalText}`;
          } 
          // For Java-style else if (sibling structure), check previous sibling
          else {
            // Check if this node has a previous sibling that is an 'else' keyword
            const nodeIndex = candidateNodes.indexOf(node);
            if (nodeIndex > 0) {
              const previousNode = candidateNodes[nodeIndex - 1];
              if (previousNode && previousNode.type === 'else') {
                isElseIf = true;
                conditionalText = `else if ${conditionalText}`;
              }
            }
          }
          
          // Use different shapes for different conditional types
          let condId;
          if (node.type === 'if_statement' || node.type === 'elif_clause') {
            const labelPrefix = isElseIf ? 'else if' : 'if';
            condId = isElseIf 
              ? flow.addElseIfStatement(node, `${labelPrefix} ${conditionalText}?`)
              : flow.addIfStatement(node, `${labelPrefix} ${conditionalText}?`);
          } else if (node.type === 'switch_statement') {
            condId = flow.addSwitchStatement(node, `${conditionalText}?`);
          } else {
            condId = flow.addDecision(node, `${conditionalText}?`);
          }
          
          flow.link(last, condId);
          
          // Process then branch (if block) with full recursive processing
          const thenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(node)) || { calls: [] };
          const thenCalls = Array.isArray(thenInfo?.calls) ? thenInfo.calls : [];
          
          if (thenCalls.length > 0) {
            const thenResult = processStatements(thenCalls, flow, languageConfig, condId, []);
            // Connect the end of then branch back to the condition for else processing
            flow.link(thenResult.last, condId, 'no');
          }
        
          // Process else/elif branches with full recursive processing
          const elseInfo = (languageConfig.extractElseBranch && languageConfig.extractElseBranch(node)) || { calls: [] };
          let elseCalls = Array.isArray(elseInfo?.calls) ? elseInfo.calls : [];
          
          // Check for elif clauses (Python) or else if statements (JavaScript)
          const elifClauses = node.children ? node.children.filter(c => c && c.type === 'elif_clause') : [];
          const elseClause = node.children ? node.children.find(c => c && c.type === 'else_clause') : null;
          
          // Check for nested if statements in else clauses (C, C++, Java)
          let nestedIfStatement = null;
          if (elseClause && elseClause.children) {
            // Look for an if_statement directly in the else clause (C-style else if)
            nestedIfStatement = elseClause.children.find(c => c && c.type === 'if_statement');
          } else {
            // For Java-style else if, look for else and if_statement as siblings
            const elseIndex = node.children ? node.children.findIndex(c => c && c.type === 'else') : -1;
            const ifIndex = node.children ? node.children.findIndex(c => c && c.type === 'if_statement') : -1;
            if (elseIndex !== -1 && ifIndex !== -1 && ifIndex > elseIndex) {
              // The if_statement that comes after else is our nested if
              nestedIfStatement = node.children[ifIndex];
              
              // For Java-style else if, we need to handle the else branch of the nested if
              // The actual else branch (final else) is in the innermost nested if statement
              if (nestedIfStatement) {
                // Find the final else clause in the nested structure
                let currentNested = nestedIfStatement;
                while (currentNested) {
                  // First try to find else_clause (standard approach)
                  const currentElseClause = currentNested.children ? currentNested.children.find(c => c && c.type === 'else_clause') : null;
                  if (currentElseClause) {
                    // Extract calls from the else clause
                    const elseBlock = currentElseClause.children.find(c => c && (c.type === 'block' || c.type === 'compound_statement'));
                    const calls = elseBlock ? findAll(elseBlock, 'method_invocation') : [];
                    elseCalls = calls;
                    break;
                  }
                  
                  // For Java, also check for else keyword followed by a block (sibling structure)
                  const elseIndex = currentNested.children ? currentNested.children.findIndex(c => c && c.type === 'else') : -1;
                  if (elseIndex !== -1 && elseIndex + 1 < currentNested.children.length) {
                    // The element after 'else' should be the block
                    const blockNode = currentNested.children[elseIndex + 1];
                    if (blockNode && (blockNode.type === 'block' || blockNode.type === 'compound_statement')) {
                      // Extract calls from the block
                      // For Java, we look for method_invocation nodes
                      const calls = findAll(blockNode, 'method_invocation');
                      elseCalls = calls;
                      break;
                    }
                  }
                  
                  // Look for another nested if
                  const nextElseIndex = currentNested.children ? currentNested.children.findIndex(c => c && c.type === 'else') : -1;
                  const nextIfIndex = currentNested.children ? currentNested.children.findIndex(c => c && c.type === 'if_statement') : -1;
                  if (nextElseIndex !== -1 && nextIfIndex !== -1 && nextIfIndex > nextElseIndex) {
                    currentNested = currentNested.children[nextIfIndex];
                  } else {
                    currentNested = null;
                  }
                }
              }
            }
          }
          
          // Process elif clauses first (Python)
          let currentCondId = condId;
          
          for (const elifClause of elifClauses) {
            // Extract condition from elif clause
            const conditionNode = elifClause.children.find(c => c && c.type === 'comparison_operator');
            const elifConditionText = conditionNode ? textOf(conditionNode) : 'condition';
            
            // Create elif node
            const elifId = flow.addElseIfStatement(elifClause, `else if ${elifConditionText}?`);
            flow.link(currentCondId, elifId, 'no');
            
            // Process elif body with full recursive processing
            const blockNode = elifClause.children.find(c => c && c.type === 'block');
            const elifCalls = blockNode ? findAll(blockNode, 'call') : [];
            
            if (elifCalls.length > 0) {
              const elifResult = processStatements(elifCalls, flow, languageConfig, elifId, []);
              // Connect the end of elif branch back for further else processing
              flow.link(elifResult.last, elifId, 'no');
            }
            
            currentCondId = elifId;
          }

          // Process nested if statements in else clauses (C, C++, Java, JavaScript)
          if (nestedIfStatement) {
            // Process the nested if statement recursively
            const nestedCondInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(nestedIfStatement)) || { text: 'condition' };
            const nestedConditionalText = nestedCondInfo.text || 'condition';
            
            // This is definitely an else if since it's nested in an else clause
            const nestedCondId = flow.addElseIfStatement(nestedIfStatement, `else if ${nestedConditionalText}?`);
            flow.link(currentCondId, nestedCondId, 'no');
            
            // Process then branch of nested if with full recursive processing
            const nestedThenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(nestedIfStatement)) || { calls: [] };
            const nestedThenCalls = Array.isArray(nestedThenInfo?.calls) ? nestedThenInfo.calls : [];
            
            if (nestedThenCalls.length > 0) {
              const nestedThenResult = processStatements(nestedThenCalls, flow, languageConfig, nestedCondId, []);
              // Connect the end of nested then branch back for else processing
              flow.link(nestedThenResult.last, nestedCondId, 'no');
            }
            
            // Process else branch of nested if with full recursive processing
            const nestedElseInfo = (languageConfig.extractElseBranch && languageConfig.extractElseBranch(nestedIfStatement)) || { calls: [] };
            let nestedElseCalls = Array.isArray(nestedElseInfo?.calls) ? nestedElseInfo.calls : [];
            
            // For Java-style else, we need to manually extract calls
            if (nestedElseCalls.length === 0) {
              // Try to find else keyword followed by a block
              const elseIndex = nestedIfStatement.children ? nestedIfStatement.children.findIndex(c => c && c.type === 'else') : -1;
              if (elseIndex !== -1 && elseIndex + 1 < nestedIfStatement.children.length) {
                const blockNode = nestedIfStatement.children[elseIndex + 1];
                if (blockNode && (blockNode.type === 'block' || blockNode.type === 'compound_statement')) {
                  // Extract calls from the block
                  // For Java, we look for method_invocation nodes
                  // For JavaScript, we look for call_expression nodes
                  const methodInvocationCalls = findAll(blockNode, 'method_invocation');
                  const callExpressionCalls = findAll(blockNode, 'call_expression');
                  const callNodes = [...methodInvocationCalls, ...callExpressionCalls];
                  nestedElseCalls = callNodes;
                }
              }
            }
            
            if (nestedElseCalls.length > 0) {
              const nestedElseResult = processStatements(nestedElseCalls, flow, languageConfig, nestedCondId, []);
              // Connect the end of nested else branch to continue the flow
              flow.link(nestedElseResult.last, nestedCondId, 'yes');
            }
          } else {
            // Process else clause for non-nested cases with full recursive processing
            if (elseCalls.length > 0) {
              const elseResult = processStatements(elseCalls, flow, languageConfig, currentCondId, []);
              // Connect the end of else branch to continue the flow
              flow.link(elseResult.last, currentCondId, 'yes');
            }
          }
          
          // For conditional statements, we don't update 'last' because conditionals don't have a single end point
          // All branches will connect to the next statement through pendingConnections
          // We keep 'last' pointing to the previous node to avoid creating extra connections
          processedNodes.add(node);
          continue;
        }
      
        // Handle loops with full recursive processing
        if (languageConfig.isLoop && languageConfig.isLoop(node)) {
          const loopInfo = (languageConfig.extractLoopInfo && languageConfig.extractLoopInfo(node)) || { type: 'loop', condition: 'condition', calls: [] };
          
          if (node.type === 'do_statement') {
            // Handle do-while loops with correct structure:
            // 1. "do" as rectangle shape
            // 2. Loop body
            // 3. "while" condition as diamond shape that loops back to "do"
            
            // Add "do" as rectangle
            const doId = flow.addAction(node, 'do');
            flow.link(last, doId);
            
            // Process loop body with full recursive processing
            const loopCalls = Array.isArray(loopInfo?.calls) ? loopInfo.calls : [];
            let bodyLast = doId;
            
            if (loopCalls.length > 0) {
              const bodyResult = processStatements(loopCalls, flow, languageConfig, bodyLast, []);
              bodyLast = bodyResult.last;
            }
            
            // Add "while" condition as diamond
            const whileId = flow.addLoopStatement(`${node.text}_while`, `while : ${loopInfo.condition || 'condition'}`);
            flow.link(bodyLast, whileId);
            
            // Loop back to "do" statement
            flow.link(whileId, doId, 'yes');
            
            // Store the while node to connect to the next statement (loop exit)
            pendingConnections.push({ from: whileId, label: 'no', type: 'next' });
            
            processedNodes.add(node);
            continue;
          } else {
            // Handle regular loops (for, while) with full recursive processing
            const loopId = flow.addLoopStatement(node, `${loopInfo.type || 'loop'}: ${loopInfo.condition || 'condition'}`);
            flow.link(last, loopId);
          
            // Process loop body with full recursive processing
            const loopCalls = Array.isArray(loopInfo?.calls) ? loopInfo.calls : [];
            let bodyLast = loopId;
            
            if (loopCalls.length > 0) {
              const bodyResult = processStatements(loopCalls, flow, languageConfig, bodyLast, []);
              bodyLast = bodyResult.last;
            }
            
            // Loop back to condition
            flow.link(bodyLast, loopId);
          
            // Store the loop node to connect to the next statement (loop exit)
            pendingConnections.push({ from: loopId, label: 'no', type: 'next' });
          
            processedNodes.add(node);
            // Don't update last for loops, as they connect to the next statement through pendingConnections
            continue;
          }
        }
      
        // Handle output operations
        if (languageConfig.isOutputCall && languageConfig.isOutputCall(node)) {
          const outputInfo = languageConfig.extractOutputInfo ? languageConfig.extractOutputInfo(node) : null;
          if (outputInfo) {
            const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
            const outputId = flow.addInputOutput(node, label);
            
            // Make connections to this statement
            if (nextConnections.length > 0) {
              for (const conn of nextConnections) {
                flow.link(conn.from, outputId, conn.label);
              }
            } else {
              flow.link(last, outputId);
            }
            
            last = outputId;
            processedNodes.add(node);
            continue;
          }
        }
        
        // Handle generic function calls (not input/output)
        if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(node)) {
          const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(node) : null;
          if (callInfo && callInfo.name) {
            const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
            const callId = flow.addAction(node, label);
            
            // Make connections to this statement
            if (nextConnections.length > 0) {
              for (const conn of nextConnections) {
                flow.link(conn.from, callId, conn.label);
              }
            } else {
              flow.link(last, callId);
            }
            
            last = callId;
            processedNodes.add(node);
            continue;
          }
        }
        
        // Handle expression statements that contain function calls
        if (node.type === 'expression_statement' && node.children) {
          const callExpr = node.children.find(c => c && c.type === 'call_expression');
          if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
            const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(callExpr) : null;
            if (callInfo && callInfo.name) {
              const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
              const callId = flow.addAction(callExpr, label);
              
              // Make connections to this statement
              if (nextConnections.length > 0) {
              for (const conn of nextConnections) {
                flow.link(conn.from, callId, conn.label);
              }
            } else {
              flow.link(last, callId);
            }
            
            last = callId;
            processedNodes.add(node);
            continue;
            }
          }
        }
      } catch (e) {
        // skip malformed node safely
      }
    }
  
    // Create end node and finalize all connections
    const end = flow.addEnd();
    
    // Make pending connections to end node
    for (const pending of pendingConnections) {
      flow.link(pending, end);
    }
    
    // Only link last to end if there are no pending connections
    // This avoids duplicate connections from conditionals
    if (pendingConnections.length === 0) {
      if (last !== start) {
        flow.link(last, end);
      } else {
        flow.link(start, end);
      }
    }
    
    flow.finalize(end);
    
    return flow.toString();
  } catch (error) {
    console.error('Error in common flowchart generation:', error);
    return 'flowchart TD\nA([start])\nB([end])\nA --> B';
  }
}