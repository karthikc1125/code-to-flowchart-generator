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
      let elseBranch = null;
      if (node.child(3) && node.child(3).type === 'else_clause') {
        // The else clause has two children: 'else' keyword and the body
        elseBranch = normalizeC(node.child(3).child(1));
      } else if (node.child(3)) {
        // Fallback for other else structures
        elseBranch = normalizeC(node.child(3));
      }
      
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
        if (func) {
          if (func.text === "printf") {
            // Format printf text as expected
            let printfText = expr.text;
            // Remove outer parentheses and format arguments
            if (printfText.startsWith('printf(') && printfText.endsWith(')')) {
              printfText = printfText.substring(7, printfText.length - 1);
              // Replace quotes and format as expected
              printfText = printfText.replace(/"/g, '').replace(/\\n/g, '\\n');
            }
            return {
              type: "IO",
              text: `printf(${printfText})`
            };
          } else if (func.text === "scanf") {
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
          }
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
      const functionName = node.child(1) ? node.child(1).text : "unknown";
      const paramNode = node.child(2);
      const paramText = paramNode ? paramNode.text : "()";
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
      return {
        type: "Assign",
        text: node.text
      };

    case "binary_expression":
    case "identifier":
    case "number_literal":
    case "parenthesized_expression":
      return {
        type: "Expr",
        text: node.text
      };

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