// Fortran language configuration for common flowchart generator

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

export const fortranConfig = {
  rootNodeTypes: ['program', 'translation_unit'],

  // Return statements inside main program block preferentially
  findStatementNodes(root) {
    if (!root || !root.children) return root?.children || [];
    // Look for program node
    const programNode = root.type === 'program' ? root : (root.children || []).find(c => c && c.type === 'program');
    if (programNode && programNode.children) {
      // Filter out program_statement, implicit_statement, and end_program_statement
      // Return only the actual executable statements
      return programNode.children.filter(c => 
        c && 
        c.type !== 'program_statement' && 
        c.type !== 'implicit_statement' && 
        c.type !== 'end_program_statement' &&
        c.type !== 'comment'
      );
    }
    return root.children || [];
  },

  // Function to identify user-defined subroutines/functions
  isFunctionDefinition(node) {
    if (!node) return false;
    return (node.type === 'subroutine' || node.type === 'function') && 
           !/\bmain\b/i.test(textOf(node));
  },

  // Function to extract function name
  extractFunctionName(node) {
    if (!node || !node.children) return '';
    const identifier = node.children.find(c => c && c.type === 'identifier');
    return identifier ? textOf(identifier) : '';
  },

  // Function to identify function/subroutine calls
  isFunctionCall(node) {
    if (!node) return false;
    return node.type === 'call_statement' || node.type === 'function_call' || node.type === 'assignment_statement';
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
    if (!node) return false;
    const text = textOf(node);
    return /\bread\s*\(/i.test(text);
  },

  extractInputInfo(node) {
    let callExpr = null;
    
    if (node.type === 'call_statement' || node.type === 'function_call' || node.type === 'read_statement') {
      callExpr = node;
    }
    
    const prompt = callExpr ? extractCallLabel(callExpr) : '';
    return { prompt };
  },

  isOutputCall(node) {
    if (!node) return false;
    return node.type === 'write_statement' || node.type === 'print_statement';
  },

  extractOutputInfo(node) {
    if (!node) return { function: '', arg: '' };
    
    if (node.type === 'write_statement') {
      // Find the output_item_list
      const outputList = node.children?.find(c => c && c.type === 'output_item_list');
      let arg = '';
      
      if (outputList) {
        // Get all string literals from the output list
        const literals = findAll(outputList, 'string_literal');
        if (literals.length > 0) {
          arg = literals.map(l => textOf(l).replace(/^'|'$/g, '').replace(/^"|"$/g, '')).join(' ');
        } else {
          arg = textOf(outputList);
        }
      }
      
      const cleanArg = arg.replace(/[\[\]{}]/g, '').trim();
      return { function: 'write', arg: cleanArg };
    }
    
    if (node.type === 'print_statement') {
      const outputList = node.children?.find(c => c && c.type === 'output_item_list');
      let arg = '';
      
      if (outputList) {
        const literals = findAll(outputList, 'string_literal');
        if (literals.length > 0) {
          arg = literals.map(l => textOf(l).replace(/^'|'$/g, '').replace(/^"|"$/g, '')).join(' ');
        } else {
          arg = textOf(outputList);
        }
      }
      
      const cleanArg = arg.replace(/[\[\]{}]/g, '').trim();
      return { function: 'print', arg: cleanArg };
    }
    
    return { function: '', arg: '' };
  },

  isConditional(node) {
    if (!node) return false;
    return node.type === 'if_statement' || node.type === 'select_case_statement';
  },

  extractConditionInfo(node) {
    if (!node || !node.children) return { text: 'condition' };
    
    // Handle select case statements (Fortran's switch)
    if (node.type === 'select_case_statement') {
      const condNode = node.children.find(c => c && c.named && c.type !== 'select');
      return { text: 'select case ' + (condNode ? textOf(condNode) : 'condition') };
    }
    
    const condNode = node.children.find(c => c && c.named && c.type !== 'if' && c.type !== 'then');
    return { text: textOf(condNode) || 'condition' };
  },

  extractThenBranch(node) {
    if (!node || !node.children) return { calls: [] };
    
    // Handle select case statements - return all children for case processing
    if (node.type === 'select_case_statement') {
      const caseBlock = node.children.find(c => c && c.type === 'case_block');
      if (caseBlock) {
        return { calls: caseBlock.children || [] };
      }
      return { calls: [] };
    }
    
    // Handle regular if statements - return ALL statements from the body
    const thenBlock = node.children.find(c => c && (c.type === 'body' || c.type === 'block' || c.type === 'statement'));
    if (thenBlock) {
      if ((thenBlock.type === 'body' || thenBlock.type === 'block') && thenBlock.children) {
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
    
    // Select case statements don't have else branches
    if (node.type === 'select_case_statement') {
      return { calls: [] };
    }
    
    // Handle else clause - return ALL statements from the body
    const elseBlock = node.children.find(c => c && (c.type === 'else_clause' || c.type === 'else_statement'));
    if (elseBlock && elseBlock.children) {
      const blockOrStmt = elseBlock.children.find(c => c && (c.type === 'body' || c.type === 'block' || c.type === 'statement' || c.type === 'if_statement'));
      if (blockOrStmt) {
        if ((blockOrStmt.type === 'body' || blockOrStmt.type === 'block') && blockOrStmt.children) {
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
    return ['do_statement', 'do_loop', 'while_statement'].includes(node.type);
  },

  extractLoopInfo(node) {
    if (!node || !node.children) return { type: 'loop', condition: 'condition', calls: [] };
    const loopType = node.type.replace('_statement', '').replace('_loop', '');
    
    let condition = 'condition';
    if (node.type === 'do_statement' || node.type === 'do_loop') {
      const condNode = node.children.find(c => c && c.named && c.type !== 'do');
      condition = condNode ? textOf(condNode) : 'condition';
    } else {
      const condNode = node.children.find(c => c && c.named && c.type !== 'while');
      condition = textOf(condNode) || 'condition';
    }
    
    // Return ALL statements from the loop body, not just call statements
    const bodyBlock = node.children.find(c => c && (c.type === 'body' || c.type === 'block'));
    if (bodyBlock) {
      if (bodyBlock.children) {
        // Return all child statements from the body block for recursive processing
        return { 
          type: loopType, 
          condition, 
          calls: bodyBlock.children.filter(c => c && c.named) 
        };
      }
    }
    // Check for single statement without block
    const singleStmt = node.children.find(c => c && c.type === 'statement');
    if (singleStmt) {
      return { type: loopType, condition, calls: [singleStmt] };
    }
    return { type: loopType, condition, calls: [] };
  },
  
  // New functions for enhanced language features
  
  isReturnStatement(node) {
    if (!node) return false;
    return node.type === 'return_statement';
  },
  
  extractReturnInfo(node) {
    if (!node || !node.children) return { value: '' };
    const returnExpr = node.children.find(c => c && c.named);
    return { value: returnExpr ? textOf(returnExpr) : '' };
  },
  
  isBreakStatement(node) {
    if (!node) return false;
    return node.type === 'exit_statement';
  },
  
  isContinueStatement(node) {
    if (!node) return false;
    return node.type === 'cycle_statement';
  }
};
