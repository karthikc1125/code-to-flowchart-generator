// C language configuration for common flowchart generator

function findAll(node, type) {
  const results = [];
  if (!node || !node.children) return results;
  if (node.type === type) results.push(node);
  for (const child of node.children) {
    if (child) results.push(...findAll(child, type));
  }
  return results;
}

function textOf(node) {
  return node?.text || '';
}

function getVariableName(node) {
  if (!node) return '';
  if (node.type === 'identifier') return node.text || '';
  return node.text || '';
}

function extractCallLabel(callNode) {
  if (!callNode || !callNode.children) return '';
  const args = callNode.children.filter(c => c && c.named).slice(1);
  if (args.length === 0) return '';
  let argText = args[0]?.text || '';
  argText = argText.trim();
  if (argText.startsWith('(') && argText.endsWith(')')) argText = argText.slice(1, -1).trim();
  if ((argText.startsWith('"') && argText.endsWith('"')) || (argText.startsWith('\'') && argText.endsWith('\''))) argText = argText.slice(1, -1);
  return argText;
}

export const cConfig = {
  rootNodeTypes: ['translation_unit'],

  // Return statements inside main() block preferentially
  findStatementNodes(root) {
    if (!root || !root.children) return root?.children || [];
    // Look for function_definition with declarator containing 'main'
    const fns = findAll(root, 'function_definition');
    const mainFn = fns.find(fn => /\bmain\b/.test(textOf(fn)));
    if (mainFn) {
      const body = (mainFn.children || []).find(c => c && (c.type === 'compound_statement'));
      return body?.children || [];
    }
    return root.children || [];
  },

  // Function to identify user-defined functions
  isFunctionDefinition(node) {
    if (!node) return false;
    return node.type === 'function_definition' && !/\bmain\b/.test(textOf(node));
  },

  // Function to extract function name
  extractFunctionName(node) {
    if (!node || !node.children) return '';
    // Look for the function declarator
    const funcDeclarator = node.children.find(c => c && c.type === 'function_declarator');
    if (funcDeclarator && funcDeclarator.children) {
      const identifier = funcDeclarator.children.find(c => c && c.type === 'identifier');
      return identifier ? textOf(identifier) : '';
    }
    return '';
  },

  // Function to identify function calls
  isFunctionCall(node) {
    if (!node) return false;
    return node.type === 'call_expression';
  },

  // Function to extract function call information
  extractFunctionCallInfo(node) {
    if (!node || !node.children) return null;
    const callee = node.children.find(c => c && c.named);
    if (callee) {
      const funcName = textOf(callee);
      // Try to extract arguments
      const argsNode = node.children.find(c => c && c.type === 'argument_list');
      const args = argsNode ? textOf(argsNode).replace(/^\(|\)$/g, '') : '';
      return { name: funcName, args: args };
    }
    return null;
  },

  isAssignment(node) {
    if (!node) return false;
    // Detect both assignment expressions and declaration expressions with initializers
    return node.type === 'assignment_expression' || 
           (node.type === 'declaration' && node.children && 
            node.children.some(child => child && child.type === 'init_declarator'));
  },

  extractVariableInfo(node) {
    if (!node || !node.children) return null;
    if (node.type === 'assignment_expression') {
      const name = getVariableName(node.children.find(c => c && c.type === 'identifier'));
      const value = node.children.find(c => c && (c.type === 'string_literal' || c.type === 'number_literal' || c.type === 'integer_literal'))?.text || 'value';
      return { name, value };
    }
    // Handle declaration with initializer
    if (node.type === 'declaration') {
      const initDeclarator = node.children.find(c => c && c.type === 'init_declarator');
      if (initDeclarator) {
        const name = getVariableName(initDeclarator.children.find(c => c && c.type === 'identifier'));
        const valueNode = initDeclarator.children.find(c => c && c.type === 'integer_literal');
        const value = valueNode ? textOf(valueNode) : 'value';
        return { name, value };
      }
    }
    return null;
  },

  isInputCall(node) {
    if (!node || !node.children) return false;
    if (node.type === 'call_expression') {
      const callee = textOf(node.children.find(c => c && c.named));
      return /\bscanf\b|\bgets\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c && c.type === 'call_expression');
      if (callExpr && callExpr.children) {
        const callee = textOf(callExpr.children.find(c => c && c.named));
        return /\bscanf\b|\bgets\b/i.test(callee);
      }
    }
    // Also check for init_declarators that contain input calls (like scanf in variable declaration)
    if (node.type === 'init_declarator') {
      const callExpr = node.children.find(c => c && c.type === 'call_expression');
      if (callExpr && callExpr.children) {
        const callee = textOf(callExpr.children.find(c => c && c.named));
        return /\bscanf\b|\bgets\b/i.test(callee);
      }
    }
    return false;
  },

  extractInputInfo(node) {
    if (!node || !node.children) return { prompt: '' };
    const callExpr = node.type === 'call_expression' ? node : node.children.find(c => c && c.type === 'call_expression');
    // For init_declarators, we need to look deeper
    if (!callExpr && node.type === 'init_declarator') {
      const callInInit = node.children.find(c => c && c.type === 'call_expression');
      if (callInInit) {
        const prompt = extractCallLabel(callInInit);
        return { prompt };
      }
    }
    const prompt = callExpr ? extractCallLabel(callExpr) : '';
    return { prompt };
  },

  isOutputCall(node) {
    if (!node) return false;
    if (node.children && node.type === 'call_expression') {
      const callee = textOf(node.children.find(c => c && c.named));
      return /\bprintf\b|\bputs\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children?.find(c => c && c.type === 'call_expression');
      if (callExpr) {
        const callee = textOf(callExpr.children.find(c => c && c.named));
        if (/\bprintf\b|\bputs\b/i.test(callee)) return true;
      }
    }
    return false;
  },

  extractOutputInfo(node) {
    if (!node) return { function: '', arg: '' };
    if (node.type === 'expression_statement') {
      const callExpr = node.children?.find(c => c && c.type === 'call_expression');
      if (callExpr) {
        const functionName = textOf(callExpr.children.find(c => c && c.named));
        const arg = extractCallLabel(callExpr);
        return { function: functionName, arg };
      }
    }
    if (node.type === 'call_expression') {
      const functionName = textOf(node.children.find(c => c && c.named));
      const arg = extractCallLabel(node);
      return { function: functionName, arg };
    }
    return { function: '', arg: '' };
  },

  isConditional(node) {
    if (!node) return false;
    return ['if_statement', 'conditional_expression', 'switch_statement'].includes(node.type);
  },

  extractConditionInfo(node) {
    if (!node || !node.children) return { text: 'condition' };
    
    // Handle switch statements differently
    if (node.type === 'switch_statement') {
      // For switch statements, the condition is in the parenthesized_expression
      const parenExpr = node.children.find(c => c && c.type === 'parenthesized_expression');
      if (parenExpr) {
        // Extract the content inside the parentheses
        const content = parenExpr.children.find(c => c && c.named);
        if (content) {
          return { text: 'switch ' + textOf(content) };
        }
        // Fallback to the full text without parentheses
        let text = textOf(parenExpr);
        if (text.startsWith('(') && text.endsWith(')')) {
          text = text.substring(1, text.length - 1);
        }
        return { text: 'switch ' + text };
      }
      return { text: 'switch condition' };
    }
    
    const condNode = node.children.find(c => c && c.named);
    return { text: textOf(condNode) || 'condition' };
  },

  extractThenBranch(node) {
    if (!node || !node.children) return { calls: [] };
    // Handle switch statements differently
    if (node.type === 'switch_statement') {
      // For switch statements, we'll process each case as a separate branch
      const compoundStatement = node.children.find(c => c && c.type === 'compound_statement');
      if (compoundStatement) {
        // Find all case statements within the switch
        const caseStatements = findAll(compoundStatement, 'case_statement');
        
        // Collect all calls from all cases, avoiding duplicates
        const allCalls = [];
        const processedStatements = new Set();
        
        for (const caseStmt of caseStatements) {
          // Skip if already processed
          if (processedStatements.has(caseStmt)) continue;
          processedStatements.add(caseStmt);
          
          const calls = findAll(caseStmt, 'call_expression');
          allCalls.push(...calls);
        }
        
        return { calls: allCalls };
      }
      return { calls: [] };
    }
    
    // Handle regular if statements
    const thenBlock = node.children.find(c => c && (c.type === 'compound_statement'));
    const calls = thenBlock ? findAll(thenBlock, 'call_expression') : [];
    return { calls };
  },

  extractElseBranch(node) {
    if (!node || !node.children) return { calls: [] };
    // Switch statements don't have else branches
    if (node.type === 'switch_statement') {
      return { calls: [] };
    }
    
    const elseBlock = node.children.find(c => c && c.type === 'else_clause');
    const calls = elseBlock ? findAll(elseBlock, 'call_expression') : [];
    return { calls };
  },

  isLoop(node) {
    if (!node) return false;
    return ['for_statement', 'while_statement', 'do_statement'].includes(node.type);
  },

  extractLoopInfo(node) {
    if (!node || !node.children) return { type: 'loop', condition: 'condition', calls: [] };
    const loopType = node.type.replace('_statement', '');
    
    // For for loops, extract the full condition
    let condition = 'condition';
    if (node.type === 'for_statement') {
      // Extract initialization, condition, and update parts
      const initDecl = node.children.find(c => c && (c.type === 'declaration' || c.type === 'init_declarator' || c.type === 'assignment_expression'));
      const condExpr = node.children.find(c => c && c.type === 'binary_expression');
      const updateExpr = node.children.find(c => c && (c.type === 'update_expression' || c.type === 'assignment_expression'));
      
      const initText = initDecl ? textOf(initDecl) : '';
      const condText = condExpr ? textOf(condExpr) : '';
      const updateText = updateExpr ? textOf(updateExpr) : '';
      
      // Format the condition properly to avoid double semicolons
      const initPart = initText ? initText.replace(/;$/, '') : '';
      const condPart = condText || '';
      const updatePart = updateText ? updateText.replace(/^;\s*/, '') : '';
      
      const parts = [initPart, condPart, updatePart].filter(Boolean);
      condition = parts.join('; ');
    } else if (node.type === 'do_statement') {
      // For do-while loops, extract the condition from the parenthesized_expression
      const condNode = node.children.find(c => c && c.type === 'parenthesized_expression');
      condition = condNode ? textOf(condNode) : 'condition';
      // Remove parentheses if present
      if (condition.startsWith('(') && condition.endsWith(')')) {
        condition = condition.substring(1, condition.length - 1);
      }
    } else {
      const condNode = node.children.find(c => c && c.named);
      condition = textOf(condNode) || 'condition';
    }
    
    const bodyBlock = node.children.find(c => c && (c.type === 'compound_statement'));
    // For C, we need to look for both call_expression and expression_statement nodes
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
    if (!node) return false;
    return node.type === 'return_statement';
  },
  
  extractReturnInfo(node) {
    if (!node || !node.children) return { value: '' };
    // Find the expression being returned
    const returnExpr = node.children.find(c => c && c.named && c.type !== 'return');
    return { value: returnExpr ? textOf(returnExpr) : '' };
  },
  
  isBreakStatement(node) {
    if (!node) return false;
    return node.type === 'break_statement';
  },
  
  isContinueStatement(node) {
    if (!node) return false;
    return node.type === 'continue_statement';
  }
};