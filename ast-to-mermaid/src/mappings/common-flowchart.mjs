import { createFlowBuilder } from './_common.mjs';
import { processSingleConditional, processConditionalChain } from './conditional-mapping.mjs';

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
    
    // Handle conditional statements using the dedicated conditional mapping file
    if (languageConfig.isConditional && languageConfig.isConditional(stmt)) {
      const result = processSingleConditional(stmt, flow, languageConfig, currentLast);
      currentLast = result;
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
    // Assignment and declaration statements should have only one connection from it
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
    // Return statements should have only one incoming connection, like assignment statements
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
        // Assignment and declaration statements should have only one connection from it
        if (languageConfig.isAssignment && languageConfig.isAssignment(node)) {
          const varInfo = languageConfig.extractVariableInfo ? languageConfig.extractVariableInfo(node) : null;
          if (varInfo && (varInfo.name || varInfo.value)) {
            const label = `${varInfo.name ?? ''} = ${varInfo.value ?? ''}`.trim();
            const assignId = flow.addAction(node, label);
            
            // Make connections to this statement
            // Assignment statements should have only one incoming connection
            if (nextConnections.length > 0) {
              // Connect only from the last node, not from all pending connections
              flow.link(last, assignId);
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
        // Return statements should have only one incoming connection, like assignment statements
        if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(node)) {
          const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(node) : { value: '' };
          const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
          const returnId = flow.addReturnStatement(node, label);
          // Make connections to this statement
          // Return statements should have only one incoming connection
          if (nextConnections.length > 0) {
            // Connect all pending next connections to this return statement
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
        
        // Handle conditional statements using the dedicated conditional mapping file
        if (languageConfig.isConditional && languageConfig.isConditional(node)) {
          // Handle switch statements specially
          if (node.type === 'switch_statement' || node.type === 'match_statement' || node.type === 'switch_expression') {
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
          
          // Handle if/else if/else chains by detecting nested structures
          // Check if this is the start of a conditional chain
          const conditionalChain = [node];
          let currentElseClause = node.children?.find(c => c.type === 'else_clause');
          
          // Look for nested else if and else statements
          while (currentElseClause) {
            const nestedIf = currentElseClause.children?.find(c => c.type === 'if_statement');
            if (nestedIf) {
              conditionalChain.push(nestedIf);
              // Look for the next else clause within this nested if
              currentElseClause = nestedIf.children?.find(c => c.type === 'else_clause');
            } else {
              // This is a final else clause (not else if)
              const elseBlock = currentElseClause.children?.find(c => 
                c.type === 'statement_block' || 
                c.type === 'expression_statement' ||
                c.type === 'block'
              );
              if (elseBlock) {
                // Add the else block as a special node in our chain
                conditionalChain.push({
                  type: 'else_clause',
                  children: [elseBlock],
                  text: 'else'
                });
              }
              break;
            }
          }
          
          // Process the conditional chain
          if (conditionalChain.length > 1) {
            // Use the chain processing function
            const chainResult = processConditionalChain(conditionalChain, flow, languageConfig, last, pendingConnections);
            last = chainResult.last;
            pendingConnections.push(...chainResult.pendingConnections);
            // Mark all nodes in the chain as processed
            for (const chainNode of conditionalChain) {
              if (chainNode && chainNode.type !== 'else_clause') { // else_clause is our synthetic node
                processedNodes.add(chainNode);
              }
            }
            continue;
          } else {
            // Single conditional statement
            const result = processSingleConditional(node, flow, languageConfig, last);
            // For single conditionals, we need to handle the pending connections properly
            // The result should include both the last node and any pending connections
            if (typeof result === 'object' && result.last && result.pendingConnections) {
              last = result.last;
              pendingConnections.push(...result.pendingConnections);
            } else {
              // Fallback for backward compatibility
              last = result;
            }
            processedNodes.add(node);
            continue;
          }
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
      if (pending && pending.from) {
        flow.link(pending.from, end, pending.label);
      }
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