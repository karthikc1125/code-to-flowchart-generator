// Java language configuration for common flowchart generator

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
  // Prefer explicit string literals anywhere under the invocation
  const str = findAll(callNode, 'string_literal')[0];
  if (str) {
    let s = textOf(str).trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith('\'') && s.endsWith('\''))) s = s.slice(1, -1);
    return s;
  }
  // Fallback: use first argument inside argument_list
  const argList = callNode.children.find(c => c && c.type === 'argument_list');
  if (argList) {
    let t = textOf(argList).trim();
    if (t.startsWith('(') && t.endsWith(')')) t = t.slice(1, -1).trim();
    // If multiple args, take the first
    const first = t.split(',')[0] || '';
    let s = first.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith('\'') && s.endsWith('\''))) s = s.slice(1, -1);
    return s;
  }
  return '';
}

function getInvocationName(inv) {
  if (!inv || !inv.children) return '';
  const fieldAccess = inv.children.find(c => c && c.type === 'field_access');
  const nameIdent = inv.children.find(c => c && c.type === 'identifier');
  if (fieldAccess && nameIdent) return `${textOf(fieldAccess)}.${textOf(nameIdent)}`;
  if (nameIdent) return textOf(nameIdent);
  const anyNamed = inv.children.find(c => c && c.named);
  return textOf(anyNamed);
}

export const javaConfig = {
  rootNodeTypes: ['program'],

  // Prefer statements inside main() method
  findStatementNodes(root) {
    if (!root || !root.children) return root?.children || [];
    // Dive into class -> method main -> block
    const classes = findAll(root, 'class_declaration');
    for (const cls of classes) {
      const body = (cls.children || []).find(c => c && c.type === 'class_body');
      if (!body) continue;
      const methods = findAll(body, 'method_declaration');
      const main = methods.find(m => /\bmain\b/.test(textOf(m)));
      if (main) {
        const block = (main.children || []).find(c => c && (c.type === 'block' || c.type === 'method_body'));
        return block?.children || [];
      }
    }
    return root.children || [];
  },
  
  // Function to identify user-defined functions
  isFunctionDefinition(node) {
    if (!node) return false;
    return node.type === 'method_declaration' && !/\bmain\b/.test(textOf(node));
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
    return node.type === 'method_invocation';
  },

  // Function to extract function call information
  extractFunctionCallInfo(node) {
    if (!node || !node.children) return null;
    const funcName = getInvocationName(node);
    // Try to extract arguments
    const argList = node.children.find(c => c && c.type === 'argument_list');
    const args = argList ? textOf(argList).replace(/^\(|\)$/g, '') : '';
    return { name: funcName, args: args };
  },

  isAssignment(node) {
    if (!node) return false;
    return node.type === 'assignment_expression' || 
           node.type === 'variable_declarator' || 
           node.type === 'local_variable_declaration';
  },

  extractVariableInfo(node) {
    if (!node || !node.children) return null;
    if (node.type === 'assignment_expression') {
      const name = getVariableName(node.children.find(c => c && c.type === 'identifier'));
      const value = node.children.find(c => c && (c.type === 'string_literal' || c.type === 'number_literal' || c.type === 'integer_literal' || c.type === 'decimal_integer_literal'))?.text || 'value';
      return { name, value };
    }
    if (node.type === 'variable_declarator') {
      const name = getVariableName(node.children.find(c => c && c.type === 'identifier'));
      const value = node.children.find(c => c && (c.type === 'string_literal' || c.type === 'number_literal' || c.type === 'integer_literal' || c.type === 'decimal_integer_literal'))?.text || 'value';
      return { name, value };
    }
    // Handle local_variable_declaration which contains variable_declarator
    if (node.type === 'local_variable_declaration') {
      const varDeclarator = node.children.find(c => c && c.type === 'variable_declarator');
      if (varDeclarator) {
        return this.extractVariableInfo(varDeclarator);
      }
    }
    return null;
  },

  isInputCall(node) {
    if (!node || !node.children) return false;
    if (node.type === 'method_invocation') {
      const callee = getInvocationName(node);
      // Specifically look for Scanner input methods like nextInt(), next(), etc.
      // Make sure it's not close() or other non-input methods
      if (/\bnext(Int|Line|Double|Float|Long|Short|Byte|Boolean|String)?\b/i.test(callee)) {
        return true;
      }
      return false; // Don't treat other Scanner methods as input
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c && c.type === 'method_invocation');
      if (callExpr && callExpr.children) {
        return this.isInputCall(callExpr); // Recursively check the method_invocation
      }
    }
    // Also check for variable declarations that contain input calls
    if (node.type === 'variable_declarator') {
      const callExpr = node.children.find(c => c && c.type === 'method_invocation');
      if (callExpr && callExpr.children) {
        return this.isInputCall(callExpr); // Recursively check the method_invocation
      }
    }
    // Check for local_variable_declaration that contains variable_declarator with input calls
    if (node.type === 'local_variable_declaration') {
      const varDeclarator = node.children.find(c => c && c.type === 'variable_declarator');
      if (varDeclarator) {
        return this.isInputCall(varDeclarator); // Recursively check the variable_declarator
      }
    }
    return false;
  },

  extractInputInfo(node) {
    let callExpr = null;
    let varDeclarator = null;
    
    if (node.type === 'method_invocation') {
      callExpr = node;
    } else if (node.type === 'expression_statement') {
      callExpr = node.children.find(c => c && c.type === 'method_invocation');
    } else if (node.type === 'variable_declarator') {
      varDeclarator = node;
      callExpr = node.children.find(c => c && c.type === 'method_invocation');
      // For variable declarators with input calls, we want to extract the variable name
      if (callExpr) {
        // Get the variable name from the declarator
        const varName = getVariableName(node.children.find(c => c && c.type === 'identifier'));
        if (varName) {
          return { prompt: varName };
        }
      }
    } else if (node.type === 'local_variable_declaration') {
      // Handle local_variable_declaration by checking its variable_declarator
      varDeclarator = node.children.find(c => c && c.type === 'variable_declarator');
      if (varDeclarator) {
        return this.extractInputInfo(varDeclarator); // Recursively extract from variable_declarator
      }
    }
    
    const prompt = callExpr ? extractCallLabel(callExpr) : '';
    return { prompt };
  },

  isOutputCall(node) {
    if (!node || !node.children) return false;
    if (node.type === 'method_invocation') {
      const callee = getInvocationName(node);
      return /(System\.out\.)?print(ln)?\b|\bprintf\b/i.test(callee);
    }
    if (node.type === 'expression_statement') {
      const callExpr = node.children.find(c => c && c.type === 'method_invocation');
      if (callExpr && callExpr.children) {
        const callee = getInvocationName(callExpr);
        return /(System\.out\.)?print(ln)?\b|\bprintf\b/i.test(callee);
      }
    }
    return false;
  },

  extractOutputInfo(node) {
    if (!node || !node.children) return { function: '', arg: '' };
    const callExpr = node.type === 'method_invocation' ? node : node.children.find(c => c && c.type === 'method_invocation');
    if (!callExpr || !callExpr.children) return { function: '', arg: '' };
    const functionName = getInvocationName(callExpr);
    const arg = extractCallLabel(callExpr);
    return { function: functionName, arg };
  },

  isConditional(node) {
    if (!node) return false;
    return ['if_statement', 'conditional_expression', 'switch_statement', 'switch_expression'].includes(node.type);
  },

  extractConditionInfo(node) {
    if (!node || !node.children) return { text: 'condition' };
    
    // Handle switch expressions
    if (node.type === 'switch_expression') {
      // For switch expressions, the condition is in the parenthesized_expression
      const parenExpr = node.children.find(c => c && c.type === 'parenthesized_expression');
      if (parenExpr) {
        // Extract the content inside the parentheses
        const content = parenExpr.children.find(c => c && c.named);
        if (content) {
          return { text: `switch ${textOf(content)}` };
        }
        // Fallback to the full text without parentheses
        let text = textOf(parenExpr);
        if (text.startsWith('(') && text.endsWith(')')) {
          text = text.substring(1, text.length - 1);
        }
        return { text: `switch ${text}` };
      }
      return { text: 'switch condition' };
    }
    
    // Handle switch statements
    if (node.type === 'switch_statement') {
      const condNode = node.children.find(c => c && c.named);
      return { text: `switch ${textOf(condNode) || 'condition'}` };
    }
    
    // Handle if statements - get the condition from parenthesized_expression
    if (node.type === 'if_statement') {
      const parenExpr = node.children.find(c => c && c.type === 'parenthesized_expression');
      if (parenExpr && parenExpr.children) {
        // Get the content inside the parentheses
        const content = parenExpr.children.find(c => c && c.named);
        if (content) {
          return { text: textOf(content) };
        }
        // Fallback to the full text without parentheses
        let text = textOf(parenExpr);
        if (text.startsWith('(') && text.endsWith(')')) {
          text = text.substring(1, text.length - 1);
        }
        return { text: text };
      }
    }
    
    const condNode = node.children.find(c => c && c.named);
    return { text: textOf(condNode) || 'condition' };
  },

  extractThenBranch(node) {
    if (!node || !node.children) return { calls: [] };
    // Handle switch statements differently
    if (node.type === 'switch_statement' || node.type === 'switch_expression') {
      // For switch statements, we'll process each case as a separate branch
      const bodyBlock = node.children.find(c => c && (c.type === 'switch_block'));
      if (bodyBlock) {
        // Find all switch block statement groups within the switch
        const statementGroups = findAll(bodyBlock, 'switch_block_statement_group');
        
        // Collect all calls from all cases
        const allCalls = [];
        for (const group of statementGroups) {
          const calls = findAll(group, 'method_invocation');
          allCalls.push(...calls);
        }
        
        return { calls: allCalls };
      }
      return { calls: [] };
    }
    
    // Handle regular if statements - look for the then block
    const thenBlock = node.children.find(c => c && (c.type === 'block' || c.type === 'expression_statement'));
    if (thenBlock) {
      // For blocks, we need to get all statements inside
      if (thenBlock.type === 'block' && thenBlock.children) {
        // Return all direct children of the block (the statements)
        const statements = thenBlock.children.filter(c => c && c.type !== '{' && c.type !== '}');
        return { calls: statements };
      }
      // For expression statements, return the statement itself
      return { calls: [thenBlock] };
    }
    return { calls: [] };
  },

  extractElseBranch(node) {
    if (!node || !node.children) return { calls: [] };
    // Switch statements don't have else branches
    if (node.type === 'switch_statement' || node.type === 'switch_expression') {
      return { calls: [] };
    }
    
    const elseBlock = node.children.find(c => c && c.type === 'else_clause');
    if (elseBlock && elseBlock.children) {
      // Find the block or statement within the else clause
      const blockOrStmt = elseBlock.children.find(c => c && (c.type === 'block' || c.type === 'expression_statement' || c.type === 'if_statement'));
      if (blockOrStmt) {
        // For blocks, we need to get all statements inside
        if (blockOrStmt.type === 'block' && blockOrStmt.children) {
          // Return all direct children of the block (the statements)
          const statements = blockOrStmt.children.filter(c => c && c.type !== '{' && c.type !== '}');
          return { calls: statements };
        }
        // For expression statements or if statements, return the statement itself
        return { calls: [blockOrStmt] };
      }
    }
    return { calls: [] };
  },

  isLoop(node) {
    if (!node) return false;
    return ['for_statement', 'while_statement', 'enhanced_for_statement', 'do_statement'].includes(node.type);
  },

  extractLoopInfo(node) {
    if (!node || !node.children) return { type: 'loop', condition: 'condition', calls: [] };
    const loopType = node.type.replace('_statement', '');
    
    // For for loops, extract the full condition
    let condition = 'condition';
    if (node.type === 'for_statement') {
      // Extract initialization, condition, and update parts
      const initDecl = node.children.find(c => c && (c.type === 'local_variable_declaration' || c.type === 'assignment_expression'));
      const condExpr = node.children.find(c => c && c.type === 'binary_expression');
      const updateExpr = node.children.find(c => c && (c.type === 'update_expression' || c.type === 'assignment_expression')); // Java can have assignment in update
      
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
    
    const bodyBlock = node.children.find(c => c && (c.type === 'block' || c.type === 'expression_statement'));
    // For Java, we need to look for both method_invocation and expression_statement nodes
    // that contain update_expressions (for increment/decrement)
    let calls = [];
    if (bodyBlock) {
      // Get method invocations
      calls = findAll(bodyBlock, 'method_invocation');
      
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