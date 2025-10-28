// Debug version with console logging
import { createFlowBuilder } from './src/mappings/_common.mjs';

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
        // Handle input operations FIRST (before assignments)
        if (languageConfig.isInputCall && languageConfig.isInputCall(node)) {
          const inputInfo = languageConfig.extractInputInfo ? languageConfig.extractInputInfo(node) : { prompt: '' };
          const label = inputInfo && inputInfo.prompt ? `read input: ${inputInfo.prompt}` : 'read input';
          const inputId = flow.addInputOutput(node, label);
          flow.link(last, inputId);
          
          // Make pending connections to this statement
          for (const pending of pendingConnections) {
            flow.link(pending, inputId);
          }
          pendingConnections.length = 0; // Clear pending connections
          
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
            flow.link(last, assignId);
            
            // Make pending connections to this statement
            for (const pending of pendingConnections) {
              flow.link(pending, assignId);
            }
            pendingConnections.length = 0; // Clear pending connections
            
            last = assignId;
            processedNodes.add(node);
            continue;
          }
        }
      
        // Handle conditional statements
        if (languageConfig.isConditional && languageConfig.isConditional(node)) {
          console.log('Processing conditional statement');
          const condInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(node)) || { text: 'condition' };
          
          // Use different shapes for different conditional types
          let condId;
          if (node.type === 'if_statement') {
            condId = flow.addIfStatement(node, `${condInfo.text || 'condition'}?`);
          } else if (node.type === 'switch_statement') {
            condId = flow.addSwitchStatement(node, `${condInfo.text || 'condition'}?`);
          } else {
            condId = flow.addDecision(node, `${condInfo.text || 'condition'}?`);
          }
          
          flow.link(last, condId);
          
          // Process then branch (if block)
          const thenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(node)) || { calls: [] };
          const thenCalls = Array.isArray(thenInfo?.calls) ? thenInfo.calls : [];
          
          if (thenCalls.length > 0) {
            let thenLast = condId;
            
            // Process calls within then branch
            for (const call of thenCalls) {
              if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
                const outputInfo = languageConfig.extractOutputInfo(call);
                if (outputInfo) {
                  const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                  const outputId = flow.addInputOutput(call, label);
                  flow.link(thenLast, outputId, thenLast === condId ? 'yes' : undefined);
                  thenLast = outputId;
                }
              }
            }
            
            // Store connection to be made to next statement
            pendingConnections.push(thenLast);
          } else {
            // Empty then branch, still show yes path
            pendingConnections.push(condId);
          }
        
          // Process else/elif branches
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
                      console.log('Found else calls in Java-style else block:', calls.length);
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
            const elifId = flow.addElseIfStatement(elifClause, `${elifConditionText}?`);
            flow.link(currentCondId, elifId, 'no');
            
            // Process elif body
            const blockNode = elifClause.children.find(c => c && c.type === 'block');
            const elifCalls = blockNode ? findAll(blockNode, 'call') : [];
            
            if (elifCalls.length > 0) {
              let elifLast = elifId;
              
              // Process calls within elif branch
              for (const call of elifCalls) {
                if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
                  const outputInfo = languageConfig.extractOutputInfo(call);
                  if (outputInfo) {
                    const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                    const outputId = flow.addInputOutput(call, label);
                    flow.link(elifLast, outputId, elifLast === elifId ? 'yes' : undefined);
                    elifLast = outputId;
                  }
                }
              }
              
              // Store connection to be made to next statement
              pendingConnections.push(elifLast);
            } else {
              // Empty elif branch
              pendingConnections.push(elifId);
            }
            
            currentCondId = elifId;
          }

          // Process nested if statements in else clauses (C, C++, Java)
          if (nestedIfStatement) {
            console.log('Processing nested if statement');
            // Process the nested if statement recursively
            const nestedCondInfo = (languageConfig.extractConditionInfo && languageConfig.extractConditionInfo(nestedIfStatement)) || { text: 'condition' };
            const nestedCondId = flow.addIfStatement(nestedIfStatement, `${nestedCondInfo.text || 'condition'}?`);
            flow.link(currentCondId, nestedCondId, 'no');
            
            // Process then branch of nested if
            const nestedThenInfo = (languageConfig.extractThenBranch && languageConfig.extractThenBranch(nestedIfStatement)) || { calls: [] };
            const nestedThenCalls = Array.isArray(nestedThenInfo?.calls) ? nestedThenInfo.calls : [];
            
            if (nestedThenCalls.length > 0) {
              let nestedThenLast = nestedCondId;
              
              // Process calls within nested then branch
              for (const call of nestedThenCalls) {
                if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
                  const outputInfo = languageConfig.extractOutputInfo(call);
                  if (outputInfo) {
                    const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                    const outputId = flow.addInputOutput(call, label);
                    flow.link(nestedThenLast, outputId, nestedThenLast === nestedCondId ? 'yes' : undefined);
                    nestedThenLast = outputId;
                  }
                }
              }
              
              // Store connection to be made to next statement
              pendingConnections.push(nestedThenLast);
            } else {
              // Empty then branch
              pendingConnections.push(nestedCondId);
            }
            
            // Process else branch of nested if
            const nestedElseInfo = (languageConfig.extractElseBranch && languageConfig.extractElseBranch(nestedIfStatement)) || { calls: [] };
            let nestedElseCalls = Array.isArray(nestedElseInfo?.calls) ? nestedElseInfo.calls : [];
            
            // For Java-style else, we need to manually extract calls
            if (nestedElseCalls.length === 0) {
              console.log('Trying to extract Java-style else calls');
              // Try to find else keyword followed by a block
              const elseIndex = nestedIfStatement.children ? nestedIfStatement.children.findIndex(c => c && c.type === 'else') : -1;
              if (elseIndex !== -1 && elseIndex + 1 < nestedIfStatement.children.length) {
                const blockNode = nestedIfStatement.children[elseIndex + 1];
                if (blockNode && (blockNode.type === 'block' || blockNode.type === 'compound_statement')) {
                  // Extract calls from the block
                  // For Java, we look for method_invocation nodes
                  nestedElseCalls = findAll(blockNode, 'method_invocation');
                  console.log('Found nested else calls:', nestedElseCalls.length);
                }
              }
            }
            
            if (nestedElseCalls.length > 0) {
              console.log('Processing nested else branch with', nestedElseCalls.length, 'calls');
              let nestedElseLast = nestedCondId;
              
              // Process calls within nested else branch
              for (const call of nestedElseCalls) {
                if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
                  const outputInfo = languageConfig.extractOutputInfo(call);
                  if (outputInfo) {
                    const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                    const outputId = flow.addInputOutput(call, label);
                    flow.link(nestedElseLast, outputId, nestedElseLast === nestedCondId ? 'no' : undefined);
                    nestedElseLast = outputId;
                  }
                }
              }
              
              // Store connection to be made to next statement
              pendingConnections.push(nestedElseLast);
            }
            
            currentCondId = nestedCondId;
          } else {
            // Process else clause for non-nested cases
            if (elseCalls.length > 0) {
              let elseLast = currentCondId;
              
              // Process calls within else branch
              for (const call of elseCalls) {
                if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
                  const outputInfo = languageConfig.extractOutputInfo(call);
                  if (outputInfo) {
                    const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                    const outputId = flow.addInputOutput(call, label);
                    flow.link(elseLast, outputId, elseLast === currentCondId ? 'no' : undefined);
                    elseLast = outputId;
                  }
                }
              }
              
              // Store connection to be made to next statement
              pendingConnections.push(elseLast);
            }
          }
          
          // For conditional statements, we don't update 'last' because conditionals don't have a single end point
          // All branches will connect to the next statement through pendingConnections
          // We keep 'last' pointing to the previous node to avoid creating extra connections
          processedNodes.add(node);
          continue;
        }
      
        // Handle loops
        if (languageConfig.isLoop && languageConfig.isLoop(node)) {
          const loopInfo = (languageConfig.extractLoopInfo && languageConfig.extractLoopInfo(node)) || { type: 'loop', condition: 'condition', calls: [] };
          const loopId = flow.addLoopStatement(node, `${loopInfo.type || 'loop'}: ${loopInfo.condition || 'condition'}`);
        flow.link(last, loopId);
        
        // Process loop body
          const loopCalls = Array.isArray(loopInfo?.calls) ? loopInfo.calls : [];
          
          if (loopCalls.length > 0) {
          let bodyLast = loopId;
          
          // Process calls in loop body
          for (const call of loopCalls) {
            if (languageConfig.isOutputCall && languageConfig.isOutputCall(call)) {
              const outputInfo = languageConfig.extractOutputInfo(call);
              if (outputInfo) {
                const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
                const outputId = flow.addInputOutput(call, label);
                flow.link(bodyLast, outputId, bodyLast === loopId ? 'yes' : undefined);
                bodyLast = outputId;
              }
            }
          }
          
          // Loop back to condition
          flow.link(bodyLast, loopId);
          }
        
        // Connect loop exit to end with 'no' label
        flow.linkToEnd(loopId, 'no');
        
          processedNodes.add(node);
          last = loopId;
          continue;
        }
      
        // Handle output operations
        if (languageConfig.isOutputCall && languageConfig.isOutputCall(node)) {
          const outputInfo = languageConfig.extractOutputInfo ? languageConfig.extractOutputInfo(node) : null;
          if (outputInfo) {
            const label = outputInfo.arg ? `${outputInfo.function} ${outputInfo.arg}` : outputInfo.function;
            const outputId = flow.addInputOutput(node, label);
            
            // Check if we have pending connections before clearing them
            const hadPendingConnections = pendingConnections.length > 0;
            
            // Make pending connections to this statement
            for (const pending of pendingConnections) {
              flow.link(pending, outputId);
            }
            pendingConnections.length = 0; // Clear pending connections
            
            // Only link from 'last' if there were no pending connections
            // This avoids duplicate connections when processing statements after conditionals
            if (!hadPendingConnections) {
              flow.link(last, outputId);
            }
            
            last = outputId;
            processedNodes.add(node);
            continue;
          }
        }
        
        // Handle return statements
        if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(node)) {
          const returnInfo = languageConfig.extractReturnInfo ? languageConfig.extractReturnInfo(node) : { value: '' };
          const label = returnInfo.value ? `return ${returnInfo.value}` : 'return';
          const returnId = flow.addReturnStatement(node, label);
          
          // Check if we have pending connections before clearing them
          const hadPendingConnections = pendingConnections.length > 0;
          
          // Make pending connections to this statement
          for (const pending of pendingConnections) {
            flow.link(pending, returnId);
          }
          pendingConnections.length = 0; // Clear pending connections
          
          // Only link from 'last' if there were no pending connections
          if (!hadPendingConnections) {
            flow.link(last, returnId);
          }
          
          last = returnId;  // Update last to point to the return node
          processedNodes.add(node);
          continue;
        }
        
        // Handle break statements
        if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(node)) {
          const breakId = flow.addBreakStatement(node, 'break');
          flow.link(last, breakId);
          flow.linkToEnd(breakId);
          processedNodes.add(node);
          continue;
        }
        
        // Handle continue statements
        if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(node)) {
          const continueId = flow.addContinueStatement(node, 'continue');
          flow.link(last, continueId);
          // For continue statements, we link back to the loop condition
          // This is a simplification - in reality, we'd need to track the enclosing loop
          flow.linkToEnd(continueId);
          processedNodes.add(node);
          continue;
        }
        
        // Handle generic function calls (not input/output)
        if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(node)) {
          const callInfo = languageConfig.extractFunctionCallInfo ? languageConfig.extractFunctionCallInfo(node) : null;
          if (callInfo && callInfo.name) {
            const label = callInfo.args ? `${callInfo.name}(${callInfo.args})` : `${callInfo.name}()`;
            const callId = flow.addAction(node, label);
            
            // Check if we have pending connections before clearing them
            const hadPendingConnections = pendingConnections.length > 0;
            
            // Make pending connections to this statement
            for (const pending of pendingConnections) {
              flow.link(pending, callId);
            }
            pendingConnections.length = 0; // Clear pending connections
            
            // Only link from 'last' if there were no pending connections
            if (!hadPendingConnections) {
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
              
              // Check if we have pending connections before clearing them
              const hadPendingConnections = pendingConnections.length > 0;
              
              // Make pending connections to this statement
              for (const pending of pendingConnections) {
                flow.link(pending, callId);
              }
              pendingConnections.length = 0; // Clear pending connections
              
              // Only link from 'last' if there were no pending connections
              if (!hadPendingConnections) {
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