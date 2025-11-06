// Pascal language configuration for common flowchart generator

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
  if ((argText.startsWith("'") && argText.endsWith("'")) || (argText.startsWith('"') && argText.endsWith('"'))) argText = argText.slice(1, -1);
  return argText;
}

export const pascalConfig = {
  rootNodeTypes: ['program', 'root'],

  // Return statements inside main program block preferentially
  findStatementNodes(root) {
    if (!root || !root.children) return root?.children || [];
    // Look for program node
    const programNode = root.type === 'program' ? root : (root.children || []).find(c => c && c.type === 'program');
    if (programNode) {
      // Find the block (begin...end)
      const blockNode = (programNode.children || []).find(c => c && c.type === 'block');
      if (blockNode) {
        return blockNode.children || [];
      }
    }
    return root.children || [];
  },

  // Function to identify user-defined procedures/functions
  isFunctionDefinition(node) {
    if (!node) return false;
    return (node.type === 'procedure_declaration' || node.type === 'function_declaration') && 
           !/\bmain\b/i.test(textOf(node));
  },

  // Function to extract function name
  extractFunctionName(node) {
    if (!node || !node.children) return '';
    const identifier = node.children.find(c => c && c.type === 'identifier');
    return identifier ? textOf(identifier) : '';
  },

  // Function to identify function/procedure calls
  isFunctionCall(node) {
    if (!node) return false;
    return node.type === 'exprCall' || node.type === 'statement';
  },

  // Function to extract function call information
  extractFunctionCallInfo(node) {
    if (!node || !node.children) return null;
    const identifier = node.children.find(c => c && c.type === 'identifier');
    if (identifier) {
      const funcName = textOf(identifier);
      // Try to extract arguments
      const argsNode = node.children.find(c => c && c.type === 'argument_list');
      const args = argsNode ? textOf(argsNode).replace(/^\(|\)$/g, '') : '';
      return { name: funcName, args: args };
    }
    return null;
  },

  isAssignment(node) {
    if (!node) return false;
    return node.type === 'assignment_statement' || node.type === 'variable_declaration';
  },

  extractVariableInfo(node) {
    if (!node || !node.children) return null;
    if (node.type === 'assignment_statement') {
      const name = getVariableName(node.children.find(c => c && c.type === 'identifier'));
      const value = node.children.find(c => c && (c.type === 'string_literal' || c.type === 'number_literal' || c.type === 'integer_literal'))?.text || 'value';
      return { name, value };
    }
    if (node.type === 'variable_declaration') {
      const name = getVariableName(node.children.find(c => c && c.type === 'identifier'));
      const value = node.children.find(c => c && (c.type === 'string_literal' || c.type === 'number_literal' || c.type === 'integer_literal'))?.text || 'value';
      return { name, value };
    }
    return null;
  },

  isInputCall(node) {
    if (!node || !node.children) return false;
    if (node.type === 'exprCall' || node.type === 'statement') {
      const text = textOf(node);
      return /\bread\b|\breadln\b|\breadstr\b/i.test(text);
    }
    return false;
  },

  extractInputInfo(node) {
    let callExpr = null;
    
    if (node.type === 'call_statement' || node.type === 'function_call') {
      callExpr = node;
    }
    
    const prompt = callExpr ? extractCallLabel(callExpr) : '';
    return { prompt };
  },

  isOutputCall(node) {
    if (!node) return false;
    if (node.type === 'exprCall' || node.type === 'statement') {
      const text = textOf(node);
      return /\bwrite\b|\bwriteln\b/i.test(text);
    }
    return false;
  },

  extractOutputInfo(node) {
    if (!node) return { function: '', arg: '' };
    
    if (node.type === 'exprCall') {
      // Find the function name
      const identifier = node.children?.find(c => c && c.type === 'identifier');
      const functionName = identifier ? textOf(identifier) : '';
      
      // Find the arguments
      const argsNode = node.children?.find(c => c && c.type === 'exprArgs');
      let arg = '';
      if (argsNode) {
        // Get all literal strings from the arguments
        const literals = findAll(argsNode, 'literalString');
        if (literals.length > 0) {
          arg = literals.map(l => textOf(l).replace(/^'|'$/g, '')).join(' ');
        } else {
          arg = textOf(argsNode);
        }
      }
      
      const cleanArg = arg.replace(/[\[\]{}]/g, '').trim();
      return { function: functionName, arg: cleanArg };
    }
    
    if (node.type === 'statement') {
      // Find nested exprCall
      const callNode = node.children?.find(c => c && c.type === 'exprCall');
      if (callNode) {
        return this.extractOutputInfo(callNode);
      }
    }
    
    return { function: '', arg: '' };
  },

  isConditional(node) {
    if (!node) return false;
    return node.type === 'if_statement' || node.type === 'case_statement';
  },

  extractConditionInfo(node) {
    if (!node || !node.children) return { text: 'condition' };
    
    // Handle case statements (Pascal's switch)
    if (node.type === 'case_statement') {
      const condNode = node.children.find(c => c && c.named && c.type !== 'case');
      return { text: 'case ' + (condNode ? textOf(condNode) : 'condition') };
    }
    
    const condNode = node.children.find(c => c && c.named && c.type !== 'if' && c.type !== 'then');
    return { text: textOf(condNode) || 'condition' };
  },

  extractThenBranch(node) {
    if (!node || !node.children) return { calls: [] };
    
    // Handle case statements - return all children for case processing
    if (node.type === 'case_statement') {
      const caseBlock = node.children.find(c => c && c.type === 'case_block');
      if (caseBlock) {
        return { calls: caseBlock.children || [] };
      }
      return { calls: [] };
    }
    
    // Handle regular if statements - return ALL statements from the body
    const thenBlock = node.children.find(c => c && (c.type === 'compound_statement' || c.type === 'statement'));
    if (thenBlock) {
      if (thenBlock.type === 'compound_statement' && thenBlock.children) {
        // Return all child statements from the block for recursive processing
        return { calls: thenBlock.children.filter(c => c && c.named) };
      }
      // Single statement
      return { calls: [thenBlock] };
    }
    return { calls: [] };
  },

  extractElseBranch(node) {
    if (!node || !node.children) return { calls: [] };
    
    // Case statements don't have else branches
    if (node.type === 'case_statement') {
      return { calls: [] };
    }
    
    // Handle else clause - return ALL statements from the body
    const elseBlock = node.children.find(c => c && (c.type === 'else_clause' || c.type === 'else_statement'));
    if (elseBlock && elseBlock.children) {
      const blockOrStmt = elseBlock.children.find(c => c && (c.type === 'compound_statement' || c.type === 'statement' || c.type === 'if_statement'));
      if (blockOrStmt) {
        if (blockOrStmt.type === 'compound_statement' && blockOrStmt.children) {
          // Return all child statements from the block for recursive processing
          return { calls: blockOrStmt.children.filter(c => c && c.named) };
        }
        // For else if or single statement
        return { calls: [blockOrStmt] };
      }
    }
    return { calls: [] };
  },

  isLoop(node) {
    if (!node) return false;
    return ['for_statement', 'while_statement', 'repeat_statement'].includes(node.type);
  },

  extractLoopInfo(node) {
    if (!node || !node.children) return { type: 'loop', condition: 'condition', calls: [] };
    const loopType = node.type.replace('_statement', '');
    
    let condition = 'condition';
    if (node.type === 'for_statement') {
      const condNode = node.children.find(c => c && c.named && c.type !== 'for' && c.type !== 'do');
      condition = condNode ? textOf(condNode) : 'condition';
    } else if (node.type === 'repeat_statement') {
      const condNode = node.children.find(c => c && c.type === 'until_clause');
      condition = condNode ? textOf(condNode).replace(/^until\s*/i, '') : 'condition';
    } else {
      const condNode = node.children.find(c => c && c.named && c.type !== 'while' && c.type !== 'do');
      condition = textOf(condNode) || 'condition';
    }
    
    // Return ALL statements from the loop body, not just call statements
    const bodyBlock = node.children.find(c => c && (c.type === 'compound_statement' || c.type === 'statement'));
    if (bodyBlock) {
      if (bodyBlock.type === 'compound_statement' && bodyBlock.children) {
        // Return all child statements from the body block for recursive processing
        return { 
          type: loopType, 
          condition, 
          calls: bodyBlock.children.filter(c => c && c.named) 
        };
      }
      // Single statement
      return { type: loopType, condition, calls: [bodyBlock] };
    }
    return { type: loopType, condition, calls: [] };
  },
  
  // New functions for enhanced language features
  
  isReturnStatement(node) {
    if (!node) return false;
    // Pascal uses function name assignment instead of return
    return node.type === 'exit_statement' || 
           (node.type === 'assignment_statement' && /^result\b/i.test(textOf(node)));
  },
  
  extractReturnInfo(node) {
    if (!node || !node.children) return { value: '' };
    const returnExpr = node.children.find(c => c && c.named);
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
