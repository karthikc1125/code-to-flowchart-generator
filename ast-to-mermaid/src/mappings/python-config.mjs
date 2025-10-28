// Python language configuration for common flowchart generator

function findAll(node, type) {
  const results = [];
  if (!node) return results;
  if (node.type === type) results.push(node);
  for (const c of node.children || []) {
    results.push(...findAll(c, type));
  }
  return results;
}

function textOf(node) { 
  return node?.text || ''; 
}

function getVariableName(node) {
  if (!node) return '';
  if (node.type === 'identifier') return node.text;
  return node.text || '';
}

function extractCallLabel(callNode) {
  // Get all children except the first one (function name)
  const args = (callNode.children || []).slice(1);
  let argText = args[0]?.text || '';
  argText = argText.trim();
  if (argText.startsWith('(') && argText.endsWith(')')) {
    argText = argText.slice(1, -1).trim();
  }
  if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith('\'') && argText.endsWith('\''))) {
    argText = argText.slice(1, -1);
  }
  return argText;
}

export const pythonConfig = {
  rootNodeTypes: ['module'],
  
  // Function to identify user-defined functions
  isFunctionDefinition(node) {
    if (!node) return false;
    return node.type === 'function_definition' && !/\bmain\b/.test(node.text);
  },

  // Function to extract function name
  extractFunctionName(node) {
    if (!node || !node.children) return '';
    const identifier = node.children.find(c => c && c.type === 'identifier');
    return identifier ? getVariableName(identifier) : '';
  },

  // Function to identify function calls
  isFunctionCall(node) {
    if (!node) return false;
    return node.type === 'call';
  },

  // Function to extract function call information
  extractFunctionCallInfo(node) {
    if (!node || !node.children) return null;
    const identifier = node.children.find(c => c && c.named);
    if (identifier) {
      const funcName = textOf(identifier);
      // Try to extract arguments
      const args = node.children.filter(c => c && c.named).slice(1);
      const argsText = args.map(arg => textOf(arg)).join(', ');
      return { name: funcName, args: argsText };
    }
    return null;
  },
  
  isAssignment(node) {
    if (!node) return false;
    // Direct check
    if (node.type === 'assignment' || node.type === 'augmented_assignment') return true;
    // Check if this is an expression statement containing an assignment
    if (node.type === 'expression_statement' && node.children) {
      return node.children.some(child => child && (child.type === 'assignment' || child.type === 'augmented_assignment'));
    }
    return false;
  },
  
  extractVariableInfo(node) {
    // Handle expression statements that contain assignments
    if (node.type === 'expression_statement' && node.children) {
      const assignmentNode = node.children.find(c => c && (c.type === 'assignment' || c.type === 'augmented_assignment'));
      if (assignmentNode) {
        return this.extractVariableInfo(assignmentNode);
      }
    }
    
    const name = getVariableName(node.children.find(c => c && c.type === 'identifier'));
    const value = node.children.find(c => c && (c.type === 'string' || c.type === 'integer' || c.type === 'float'))?.text || 'value';
    return { name, value };
  },
  
  isInputCall(node) {
    if (!node) return false;
    
    // console.log('isInputCall called with node type:', node.type);
    
    if (node.type === 'call') {
      // Get the first child which should be the function name
      const calleeNode = node.children && node.children.length > 0 ? node.children[0] : null;
      const callee = textOf(calleeNode);
      // console.log('  Call node, callee:', callee);
      if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
        // console.log('  Found input call');
        return true;
      }
      // Check for nested input calls like int(input(...))
      // Recursively check all children, including deep into argument lists
      if (node.children) {
        for (const child of node.children) {
          if (this.isInputCall(child)) {
            // console.log('  Found input call in child');
            return true;
          }
          // Special handling for argument lists which may contain nested calls
          if (child.type === 'argument_list' && child.children) {
            for (const argChild of child.children) {
              if (this.isInputCall(argChild)) {
                // console.log('  Found input call in argument list');
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    
    if (node.type === 'expression_statement') {
      // console.log('  Expression statement, checking children');
      // For expression statements, check all children recursively
      if (node.children) {
        for (const child of node.children) {
          if (this.isInputCall(child)) {
            // console.log('  Found input call in expression statement child');
            return true;
          }
        }
      }
      return false;
    }
    
    // Also check for assignments that contain input calls
    if (node.type === 'assignment') {
      // console.log('  Assignment node, checking children');
      // Check all children of the assignment
      if (node.children) {
        for (const child of node.children) {
          if (this.isInputCall(child)) {
            // console.log('  Found input call in assignment child');
            return true;
          }
        }
      }
      return false;
    }
    
    // console.log('  Not handling this node type');
    return false;
  },
  
  extractInputInfo(node) {
    let callExpr = null;
    
    // Helper function to find input call recursively
    const findInputCall = (n) => {
      if (!n) return null;
      if (n.type === 'call') {
        // Get the first child which should be the function name
        const calleeNode = n.children && n.children.length > 0 ? n.children[0] : null;
        const callee = textOf(calleeNode);
        if (/\binput\b|\bread\b|\braw_input\b/i.test(callee)) {
          return n;
        }
      }
      // Check children for nested input calls
      if (n.children) {
        for (const child of n.children) {
          const found = findInputCall(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    if (node.type === 'call') {
      callExpr = findInputCall(node);
    } else if (node.type === 'expression_statement') {
      // For expression statements, look for call or assignment children
      const callChild = node.children.find(c => c.type === 'call');
      if (callChild) {
        callExpr = findInputCall(callChild);
      } else {
        // Look for assignment children that might contain calls
        const assignmentChild = node.children.find(c => c.type === 'assignment');
        if (assignmentChild) {
          callExpr = findInputCall(assignmentChild);
        }
      }
    } else if (node.type === 'assignment') {
      callExpr = findInputCall(node);
      // console.log('Assignment node, callExpr:', callExpr ? callExpr.type : 'null');
      // For assignments with input calls, we want to show the variable name
      if (callExpr) {
        const varName = getVariableName(node.children.find(c => c.type === 'identifier'));
        // console.log('Variable name:', varName);
        if (varName) {
          // Check if the input call has a prompt argument
          const prompt = extractCallLabel(callExpr);
          // console.log('Assignment with input - varName:', varName, 'prompt:', prompt);
          if (prompt) {
            // console.log('Returning prompt:', prompt);
            return { prompt: prompt };
          }
          // If no prompt, use the variable name
          // console.log('Returning variable name:', varName);
          return { prompt: varName };
        }
      }
    }
    
    const prompt = callExpr ? extractCallLabel(callExpr) : '';
    // console.log('Final prompt for node type', node.type, ':', prompt);
    return { prompt };
  },
  
  isOutputCall(node) {
    if (node.type === 'call') {
      // For Python calls, the first child is typically the function identifier
      const calleeNode = node.children && node.children.length > 0 ? node.children[0] : null;
      const callee = textOf(calleeNode);
      return /\bprint\b|\boutput\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c.type === 'call');
      if (callExpr) {
        // For Python calls, the first child is typically the function identifier
        const calleeNode = callExpr.children && callExpr.children.length > 0 ? callExpr.children[0] : null;
        const callee = textOf(calleeNode);
        return /\bprint\b|\boutput\b/i.test(callee);
      }
    }
    return false;
  },
  
  extractOutputInfo(node) {
    const callExpr = node.type === 'call' ? node : node.children.find(c => c.type === 'call');
    // For Python calls, the first child is typically the function identifier
    const calleeNode = callExpr.children && callExpr.children.length > 0 ? callExpr.children[0] : null;
    const functionName = textOf(calleeNode);
    const arg = extractCallLabel(callExpr);
    return { function: functionName, arg };
  },
  
  isConditional(node) {
    return ['if_statement', 'conditional_expression', 'match_statement'].includes(node.type);
  },
  
  extractConditionInfo(node) {
    // Handle match statements (Python's switch)
    if (node.type === 'match_statement') {
      // For match statements, the condition is the second child (after 'match')
      const conditionNode = node.children && node.children.length > 1 ? node.children[1] : null;
      return { text: `match ${conditionNode ? textOf(conditionNode) : 'condition'}` };
    }
    
    const condNode = (node.children || []).find(c => c.named);
    return { text: textOf(condNode) || 'condition' };
  },
  
  extractThenBranch(node) {
    // Handle match statements (Python's switch)
    if (node.type === 'match_statement') {
      // For match statements, we'll process each case as a separate branch
      const bodyBlock = node.children.find(c => c && (c.type === 'block'));
      if (bodyBlock) {
        // Find all case clauses within the match
        const caseClauses = bodyBlock.children.filter(c => c && c.type === 'case_clause');
        
        // Collect all calls from all cases
        const allCalls = [];
        for (const caseClause of caseClauses) {
          // Each case clause has a block with the actual code
          const caseBlock = caseClause.children.find(c => c && c.type === 'block');
          if (caseBlock) {
            const calls = findAll(caseBlock, 'call');
            allCalls.push(...calls);
          }
        }
        
        return { calls: allCalls };
      }
      return { calls: [] };
    }
    
    // Handle regular if statements
    const thenBlock = node.children.find(c => c.type === 'block' || c.type === 'expression_statement');
    const calls = thenBlock ? findAll(thenBlock, 'call') : [];
    return { calls };
  },
  
  extractElseBranch(node) {
    // Match statements don't have else branches in the same way
    if (node.type === 'match_statement') {
      return { calls: [] };
    }
    
    // For Python if/elif/else statements, we need to handle elif clauses specially
    if (node.type === 'if_statement') {
      // Look for else_clause first
      const elseBlock = node.children.find(c => c.type === 'else_clause');
      if (elseBlock) {
        const calls = findAll(elseBlock, 'call');
        return { calls };
      }
      
      // If no else clause, return empty calls
      return { calls: [] };
    }
    
    const elseBlock = node.children.find(c => c.type === 'else_clause');
    const calls = elseBlock ? findAll(elseBlock, 'call') : [];
    return { calls };
  },

  isLoop(node) {
    return ['for_statement', 'while_statement', 'do_statement'].includes(node.type);
  },
  
  extractLoopInfo(node) {
    const loopType = node.type.replace('_statement', '');
    
    // For for loops, extract the full condition
    let condition = 'condition';
    if (node.type === 'for_statement') {
      // Extract the for loop condition (e.g., "i in range(10)")
      // Find the identifier, 'in' keyword, and the call
      const identifierNode = node.children.find(c => c && c.type === 'identifier');
      const callNode = node.children.find(c => c && c.type === 'call');
      
      const identifierText = identifierNode ? textOf(identifierNode) : '';
      const callText = callNode ? textOf(callNode) : '';
      
      if (identifierText && callText) {
        condition = `${identifierText} in ${callText}`;
      } else {
        condition = identifierText || callText || 'condition';
      }
    } else if (node.type === 'while_statement') {
      // For while loops, extract the condition from the comparison_operator or other condition nodes
      const condNode = node.children.find(c => c && (c.type === 'comparison_operator' || c.type === 'boolean_operator' || c.named));
      condition = condNode ? textOf(condNode) : 'condition';
    } else if (node.type === 'do_statement') {
      // For do-while loops (Python doesn't have native do-while, but we'll handle it if present)
      const condNode = (node.children || []).find(c => c.named);
      condition = textOf(condNode) || 'condition';
    } else {
      const condNode = (node.children || []).find(c => c.named);
      condition = textOf(condNode) || 'condition';
    }
    
    const bodyBlock = node.children.find(c => c.type === 'block' || c.type === 'expression_statement');
    // For Python, we need to look for both call and expression_statement nodes
    // that contain augmented_assignment (for +=, -=, etc.)
    let calls = [];
    if (bodyBlock) {
      // Get call expressions
      calls = findAll(bodyBlock, 'call');
      
      // Also get expression statements that contain augmented assignments
      const exprStatements = findAll(bodyBlock, 'expression_statement');
      for (const stmt of exprStatements) {
        if (stmt && stmt.children) {
          // Look for augmented assignments
          const augAssigns = findAll(stmt, 'augmented_assignment');
          if (augAssigns.length > 0) {
            // This is an augmented assignment statement, add it to calls
            calls.push(stmt);
          }
        }
      }
    }
    return { type: loopType, condition, calls };
  },
  
  // New functions for enhanced language features
  
  isReturnStatement(node) {
    return node.type === 'return_statement';
  },
  
  extractReturnInfo(node) {
    if (!node || !node.children) return { value: '' };
    // Find the expression being returned
    const returnExpr = node.children.find(c => c && c.named && c.type !== 'return');
    return { value: returnExpr ? textOf(returnExpr) : '' };
  },
  
  isBreakStatement(node) {
    return node.type === 'break_statement';
  },
  
  isContinueStatement(node) {
    return node.type === 'continue_statement';
  }
};

