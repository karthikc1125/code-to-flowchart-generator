// TypeScript language configuration for common flowchart generator

function findAll(node, type) {
  const results = [];
  if (!node) return results;
  if (node.type === type) results.push(node);
  for (const c of node.children || []) {
    results.push(...findAll(c, type));
  }
  return results;
}

function findCallName(node) {
  if (!node) return '';
  const memberExpr = (node.children || []).find(c => c.type === 'member_expression');
  if (memberExpr) {
    return memberExpr.text || '';
  }
  const identifier = (node.children || []).find(c => c.type === 'identifier');
  return identifier?.text || '';
}

function extractCallLabel(callNode) {
  const argsNode = (callNode.children || []).find(c => c.type === 'arguments');
  if (argsNode) {
    const argNodes = findAll(argsNode, 'identifier').concat(findAll(argsNode, 'string'));
    if (argNodes.length > 0) {
      return argNodes[0].text || '';
    }
  }
  return '';
}

function getVariableName(node) {
  if (!node) return '';
  if (node.type === 'identifier') return node.text;
  return node.text || '';
}

function textOf(node) { 
  return node?.text || ''; 
}

export const typescriptConfig = {
  rootNodeTypes: ['program'],
  
  isAssignment(node) {
    return node.type === 'assignment_expression' || 
           node.type === 'variable_declaration' ||
           node.type === 'lexical_declaration' ||
           node.type === 'const_declaration' ||
           node.type === 'let_declaration';
  },
  
  extractVariableInfo(node) {
    const declarator = node.children.find(c => c.type === 'variable_declarator') || node;
    const name = getVariableName(declarator.children.find(c => c.type === 'identifier'));
    const value = declarator.children.find(c => 
      c.type === 'string' || 
      c.type === 'number' || 
      c.type === 'string_literal' ||
      c.type === 'numeric_literal'
    )?.text || 'value';
    return { name, value };
  },
  
  isInputCall(node) {
    if (node.type === 'call_expression') {
      const callee = findCallName(node);
      return /\bprompt\b|\bread\b|\binput\b|\bgets\b|\bscanf\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c.type === 'call_expression');
      if (callExpr) {
        const callee = findCallName(callExpr);
        return /\bprompt\b|\bread\b|\binput\b|\bgets\b|\bscanf\b/i.test(callee);
      }
    }
    return false;
  },
  
  extractInputInfo(node) {
    const callExpr = node.type === 'call_expression' ? node : node.children.find(c => c.type === 'call_expression');
    const prompt = extractCallLabel(callExpr);
    return { prompt };
  },
  
  isOutputCall(node) {
    if (node.type === 'call_expression') {
      const callee = findCallName(node);
      return /\bconsole\.log\b|\bprint\b|\bprintf\b|\bputs\b|\bcout\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c.type === 'call_expression');
      if (callExpr) {
        const callee = findCallName(callExpr);
        return /\bconsole\.log\b|\bprint\b|\bprintf\b|\bputs\b|\bcout\b/i.test(callee);
      }
    }
    return false;
  },
  
  extractOutputInfo(node) {
    const callExpr = node.type === 'call_expression' ? node : node.children.find(c => c.type === 'call_expression');
    const functionName = findCallName(callExpr);
    const arg = extractCallLabel(callExpr);
    return { function: functionName, arg };
  },
  
  isConditional(node) {
    return ['if_statement', 'conditional_expression', 'switch_statement'].includes(node.type);
  },
  
  extractConditionInfo(node) {
    // Handle switch statements
    if (node.type === 'switch_statement') {
      const condNode = node.children.find(c => 
        c.type === 'parenthesized_expression'
      );
      return { text: `switch ${condNode?.text || 'condition'}` };
    }
    
    const condNode = node.children.find(c => 
      c.type === 'parenthesized_expression' || 
      c.type === 'condition' ||
      c.named
    );
    return { text: condNode?.text || 'condition' };
  },
  
  extractThenBranch(node) {
    // Handle switch statements differently
    if (node.type === 'switch_statement') {
      // For switch statements, we'll process each case as a separate branch
      const switchBody = node.children.find(c => c && c.type === 'switch_body');
      if (switchBody) {
        // Find all switch cases within the switch
        const switchCases = switchBody.children.filter(c => c && (c.type === 'switch_case' || c.type === 'switch_default'));
        
        // Collect all calls from all cases
        const allCalls = [];
        for (const switchCase of switchCases) {
          const calls = findAll(switchCase, 'call_expression');
          allCalls.push(...calls);
        }
        
        return { calls: allCalls };
      }
      return { calls: [] };
    }
    
    const thenBlock = node.children.find(c => c.type === 'statement_block' || c.type === 'expression_statement');
    const calls = thenBlock ? findAll(thenBlock, 'call_expression') : [];
    return { calls };
  },
  
  extractElseBranch(node) {
    // Switch statements don't have else branches in the same way
    if (node.type === 'switch_statement') {
      return { calls: [] };
    }
    
    const elseBlock = node.children.find(c => c.type === 'else_clause');
    const calls = elseBlock ? findAll(elseBlock, 'call_expression') : [];
    return { calls };
  },
  
  isLoop(node) {
    return ['for_statement', 'while_statement', 'do_statement', 'for_in_statement', 'for_of_statement'].includes(node.type);
  },
  
  extractLoopInfo(node) {
    const loopType = node.type.replace('_statement', '');
    
    // For for loops, extract the full condition
    let condition = 'condition';
    if (node.type === 'for_statement') {
      // Extract initialization, condition, and update parts
      const initDecl = node.children.find(c => c && (c.type === 'lexical_declaration' || c.type === 'variable_declaration' || c.type === 'var_declaration'));
      const condExpr = node.children.find(c => c && c.type === 'binary_expression');
      const updateExpr = node.children.find(c => c && c.type === 'update_expression');
      
      const initText = initDecl ? textOf(initDecl) : '';
      const condText = condExpr ? textOf(condExpr) : '';
      const updateText = updateExpr ? textOf(updateExpr) : '';
      
      // Format the condition properly to avoid double semicolons
      const initPart = initText ? initText.replace(/;$/, '') : '';
      const condPart = condText || '';
      const updatePart = updateText ? updateText.replace(/^;\s*/, '') : '';
      
      const parts = [initPart, condPart, updatePart].filter(Boolean);
      condition = parts.join('; ');
    } else if (node.type === 'for_in_statement' || node.type === 'for_of_statement') {
      // For for-in and for-of loops, extract the full condition
      const condNodes = node.children.filter(c => c && c.named);
      condition = condNodes.map(c => textOf(c)).join(' ');
    } else if (node.type === 'do_statement') {
      // For do-while loops, extract the condition from the parenthesized_expression
      const condNode = node.children.find(c => c && c.type === 'parenthesized_expression');
      condition = condNode ? textOf(condNode) : 'condition';
      // Remove parentheses if present
      if (condition.startsWith('(') && condition.endsWith(')')) {
        condition = condition.substring(1, condition.length - 1);
      }
    } else {
      const condNode = node.children.find(c => 
        c.type === 'parenthesized_expression' || 
        c.type === 'condition' ||
        c.named
      );
      condition = condNode?.text || 'condition';
    }
    
    const bodyBlock = node.children.find(c => c.type === 'statement_block' || c.type === 'expression_statement');
    // For TypeScript, we need to look for both call_expression and expression_statement nodes
    // that contain update_expressions (for increment/decrement)
    let calls = [];
    if (bodyBlock) {
      // Get call expressions
      calls = findAll(bodyBlock, 'call_expression');
      
      // Also get expression statements that contain update expressions
      const exprStatements = findAll(bodyBlock, 'expression_statement');
      for (const stmt of exprStatements) {
        if (stmt && stmt.children) {
          // Look for update expressions
          const updateExprs = findAll(stmt, 'update_expression');
          if (updateExprs.length > 0) {
            // This is an increment/decrement statement, add it to calls
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
    return { value: returnExpr ? returnExpr.text : '' };
  },
  
  isBreakStatement(node) {
    return node.type === 'break_statement';
  },
  
  isContinueStatement(node) {
    return node.type === 'continue_statement';
  },
  
  // Function to identify function calls
  isFunctionCall(node) {
    if (!node) return false;
    return node.type === 'call_expression';
  },

  // Function to extract function call information
  extractFunctionCallInfo(node) {
    if (!node || !node.children) return null;
    const funcName = findCallName(node);
    const argsNode = (node.children || []).find(c => c.type === 'arguments');
    const args = argsNode ? argsNode.text.replace(/^\(|\)$/g, '') : '';
    return { name: funcName, args: args };
  },
  
  // Function to identify user-defined functions
  isFunctionDefinition(node) {
    if (!node) return false;
    return node.type === 'function_declaration' && !/\bmain\b/.test(node.text);
  },

  // Function to extract function name
  extractFunctionName(node) {
    if (!node || !node.children) return '';
    const identifier = node.children.find(c => c && c.type === 'identifier');
    return identifier ? getVariableName(identifier) : '';
  }
};

