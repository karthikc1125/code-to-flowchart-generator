export function normalizeC(node) {
  if (!node) return null;

  switch (node.type) {
    // -------------------------
    // ROOT NODE
    // -------------------------
    case "translation_unit":
      // Return the children as a block
      return {
        type: "Block",
        body: node.children
          .map(normalizeC)
          .filter(Boolean)
      };

    // -------------------------
    // CONDITIONALS
    // -------------------------
    case "if_statement":
      // Handle else clause properly
      // Search for else_clause among children since comments can shift positions
      let elseClause = null;
      for (let i = 0; i < node.children.length; i++) {
        if (node.child(i) && node.child(i).type === 'else_clause') {
          elseClause = node.child(i);
          break;
        }
      }
      
      let elseBranch = null;
      if (elseClause) {
        // The else clause has two children: 'else' keyword and the body
        elseBranch = normalizeC(elseClause.child(1));
      } else if (node.child(3)) {
        // Fallback for other else structures (maintain backward compatibility)
        elseBranch = normalizeC(node.child(3));
      }
      
      console.log('DEBUG: Processing if_statement, condition:', node.child(1)?.text);
      return {
        type: "If",
        cond: normalizeC(node.child(1)),
        then: normalizeC(node.child(2)),
        else: elseBranch
      };

    // -------------------------
    // LOOPS
    // -------------------------
    case "for_statement":
      // Handle both declaration-style and assignment-style for loops
      // Both styles have the same pattern:
      // Child 2: init
      // Child 3/4: condition (after semicolon)
      // Child 5/6: update (after semicolon)  
      // Child 7/8: body (after closing parenthesis)
      
      const initNode = node.child(2);
      
      // Find condition (first binary_expression after init)
      let condNode = null;
      let updateNode = null;
      let forBodyNode = null;
      
      // Look for the condition, update, and body nodes
      for (let i = 3; i < node.children.length; i++) {
        const child = node.child(i);
        if (!child) continue;
        
        if (child.type === "binary_expression" && !condNode) {
          condNode = child;
        } else if (child.type === "update_expression" && !updateNode) {
          updateNode = child;
        } else if (child.type === "compound_statement" && !forBodyNode) {
          forBodyNode = child;
        }
      }
      
      return {
        type: "For",
        init: normalizeC(initNode),
        cond: normalizeC(condNode),
        update: normalizeC(updateNode),
        body: normalizeC(forBodyNode)
      };

    case "while_statement":
      return {
        type: "While",
        cond: normalizeC(node.child(1)),
        body: normalizeC(node.child(2))
      };

    case "do_statement":
      return {
        type: "DoWhile",
        body: normalizeC(node.child(1)),
        cond: normalizeC(node.child(3))
      };

    // -------------------------
    // SWITCH
    // -------------------------
    case "switch_statement":
      return {
        type: "Switch",
        cond: normalizeC(node.child(1)),
        body: normalizeC(node.child(2))
      };
    
    case "case_statement":
      // Check if this is actually a default statement
      if (node.child(0)?.text === "default") {
        return {
          type: "Default",
          body: node.children.slice(2).map(normalizeC).filter(Boolean)
        };
      }
      
      return {
        type: "Case",
        value: node.child(1)?.text || null,
        body: node.children.slice(3).map(normalizeC).filter(Boolean)
      };
    
    case "default_statement":
      return {
        type: "Default",
        body: node.children.slice(2).map(normalizeC).filter(Boolean)
      };
    
    case "break_statement":
      return {
        type: "Break"
      };
    
    case "continue_statement":
      return {
        type: "Continue"
      };
    
    case "expression_statement":
      // Handle printf and scanf calls
      const expr = node.child(0);
      if (expr && expr.type === "call_expression") {
        const func = expr.child(0);
        if (func && func.text === "printf") {
          // Format printf text as expected
          let printfText = expr.text;
          // Remove outer parentheses and format arguments
          if (printfText.startsWith('printf(') && printfText.endsWith(')')) {
            printfText = printfText.substring(7, printfText.length - 1);
            // Replace quotes and format as expected
            printfText = printfText.replace(/"/g, '').replace(/, /g, ' , ').replace(/\n/g, '\\n');
          }
          return {
            type: "IO",
            text: `printf(${printfText})`
          };
        } else if (func && func.text === "scanf") {
          // Format scanf text as expected
          let scanfText = expr.text;
          // Remove outer parentheses
          if (scanfText.startsWith('scanf(') && scanfText.endsWith(')')) {
            scanfText = scanfText.substring(6, scanfText.length - 1);
          }
          return {
            type: "IO",
            text: `scanf(${scanfText})`
          };
        } else if (func) {
          // Handle other function calls
          return {
            type: "FunctionCall",
            name: func.text,
            arguments: expr.children ? expr.children.slice(1) : [] // Skip the function name
          };
        }
      }
      // For other expressions, just return the text
      return {
        type: "Expr",
        text: node.text
      };
    
    case "update_expression":
      return {
        type: "Expr",
        text: node.text
      };
    
    case "declaration":
      return {
        type: "Decl",
        text: node.text
      };
    
    case "compound_statement":
      // Make sure we have children and they make sense
      if (!node.children || node.children.length < 2) {
        return {
          type: "Block",
          body: []
        };
      }
      return {
        type: "Block",
        body: node.children
          .slice(1, -1) // Remove opening and closing braces
          .map(normalizeC)
          .filter(Boolean)
      };

    // -------------------------
    // FUNCTIONS
    // -------------------------
    case "function_definition":
      // More robust function definition handling
      // Extract function name from the identifier inside function_declarator
      const functionDeclarator = node.child(1);
      let functionName = "unknown";
      let paramText = "()";
      
      if (functionDeclarator && functionDeclarator.type === 'function_declarator') {
        // Get the identifier (function name)
        const identifier = functionDeclarator.child(0);
        if (identifier && identifier.type === 'identifier') {
          functionName = identifier.text;
        }
        
        // Get the parameter list
        const paramListNode = functionDeclarator.child(1);
        if (paramListNode) {
          paramText = paramListNode.text;
        }
      }
      
      const bodyNode = node.child(node.children.length - 1);
      
      return {
        type: "Function",
        name: functionName + paramText,
        parameters: paramText,
        body: bodyNode ? normalizeC(bodyNode) : null
      };

    // -------------------------
    // BASIC STATEMENTS
    // -------------------------
    case "return_statement":
      return {
        type: "Return",
        value: node.child(1)?.text || null
      };

    case "assignment_expression":
      // Check if this assignment expression contains function calls
      const assignFunctionCalls = [];
      
      // Recursively search for function calls in children
      function findAssignFunctionCalls(n) {
        if (!n) return;
        
        if (n.type === 'call_expression') {
          const func = n.child(0);
          if (func && func.type === 'identifier') {
            assignFunctionCalls.push(func.text);
          }
        }
        
        if (n.children) {
          n.children.forEach(child => findAssignFunctionCalls(child));
        }
      }
      
      findAssignFunctionCalls(node);
      
      const assignNode = {
        type: "Assign",
        text: node.text
      };
      
      // If we found function calls, store them for later processing
      if (assignFunctionCalls.length > 0) {
        assignNode.functionCalls = assignFunctionCalls;
      }
      
      return assignNode;

    case "binary_expression":
      console.log('DEBUG: Processing binary expression:', node.text);
      // Check if this binary expression contains function calls
      const functionCalls = [];
      
      // Recursively search for function calls in children
      function findFunctionCalls(n) {
        if (!n) return;
        
        console.log('DEBUG: Checking node in findFunctionCalls:', n.type, n.text);
        if (n.type === 'call_expression') {
          const func = n.child(0);
          if (func && func.type === 'identifier') {
            console.log('DEBUG: Found function call in binary expression:', func.text);
            functionCalls.push(func.text);
          }
        }
        
        if (n.children) {
          n.children.forEach(child => findFunctionCalls(child));
        }
      }
      
      findFunctionCalls(node);
      
      const exprNode = {
        type: "Expr",
        text: node.text
      };
      
      // If we found function calls, store them for later processing
      if (functionCalls.length > 0) {
        console.log('DEBUG: Found function calls in binary expression:', functionCalls);
        exprNode.functionCalls = functionCalls;
      }
      
      return exprNode;
      
    case "identifier":
    case "number_literal":
    case "parenthesized_expression":
      // Check if this parenthesized expression contains function calls
      const parenFunctionCalls = [];
      
      // Recursively search for function calls in children
      function findParenFunctionCalls(n) {
        if (!n) return;
        
        console.log('DEBUG: Checking node in findParenFunctionCalls:', n.type, n.text);
        if (n.type === 'call_expression') {
          const func = n.child(0);
          if (func && func.type === 'identifier') {
            console.log('DEBUG: Found function call in parenthesized expression:', func.text);
            parenFunctionCalls.push(func.text);
          }
        }
        
        if (n.children) {
          n.children.forEach(child => findParenFunctionCalls(child));
        }
      }
      
      findParenFunctionCalls(node);
      
      const parenExprNode = {
        type: "Expr",
        text: node.text
      };
      
      // If we found function calls, store them for later processing
      if (parenFunctionCalls.length > 0) {
        console.log('DEBUG: Found function calls in parenthesized expression:', parenFunctionCalls);
        parenExprNode.functionCalls = parenFunctionCalls;
      }
      
      return parenExprNode;

    // -------------------------
    // BLOCKS
    // -------------------------
    case "compound_statement":
      // Make sure we have children
      if (!node.children) {
        return {
          type: "Block",
          body: []
        };
      }
      return {
        type: "Block",
        body: node.children
          .map(normalizeC)
          .filter(Boolean)
      };

    default:
      return null;
  }
}