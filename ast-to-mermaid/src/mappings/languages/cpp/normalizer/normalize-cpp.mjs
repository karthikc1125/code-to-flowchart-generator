// Helper function to extract function calls from expressions
function extractFunctionCalls(text) {
  if (!text) return [];
  
  const functionCalls = [];
  // Match function calls: word followed by parentheses with optional content
  const functionCallRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)/g;
  let match;
  
  while ((match = functionCallRegex.exec(text)) !== null) {
    // Filter out common keywords that aren't function calls
    const keywords = ['if', 'for', 'while', 'switch', 'return'];
    if (!keywords.includes(match[1])) {
      functionCalls.push(match[1]);
    }
  }
  
  return functionCalls;
}

/**
 * Normalize C++ AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizeCpp(node) {
  if (!node) return null;
  
  // Convert C++-specific AST nodes to unified node types
  switch (node.type) {
    case "translation_unit":
      // Return the children as a block
      return {
        type: "Block",
        body: node.children
          .map(normalizeCpp)
          .filter(Boolean)
      };
      
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
        body: bodyNode ? normalizeCpp(bodyNode) : null
      };
      
    case "compound_statement":
      // Handle compound statements (blocks with { })
      return {
        type: "Block",
        body: node.children
          .slice(1, -1) // Remove opening and closing braces
          .map(normalizeCpp)
          .filter(Boolean)
      };
      
    case "if_statement":
      // Handle if statements with proper else clause processing
      const condition = normalizeCpp(node.child(1)); // condition is typically at index 1 (after 'if')
      const thenBlock = normalizeCpp(node.child(2)); // then block is typically at index 2
      
      // Check for else clause (typically at index 3 in C++)
      let elseBlock = null;
      const elseClause = node.child(3);
      if (elseClause && elseClause.type === 'else_clause') {
        // The else clause contains the actual else statement
        // In C++, "else if" is parsed as "else" + "if_statement"
        elseBlock = normalizeCpp(elseClause.child(1)); // Typically the statement after 'else'
      }
      
      return {
        type: "If",
        cond: condition,
        then: thenBlock,
        else: elseBlock
      };
      
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
        init: normalizeCpp(initNode),
        cond: normalizeCpp(condNode),
        update: normalizeCpp(updateNode),
        body: normalizeCpp(forBodyNode)
      };
      
    case "while_statement":
      return {
        type: "While",
        cond: normalizeCpp(node.child(1)), // condition is typically at index 1
        body: normalizeCpp(node.child(2)) // body is typically at index 2
      };
      
    case "expression_statement":
      // Check if this expression contains cout or cin calls
      if (node.text && (node.text.includes('cout') || node.text.includes('cin'))) {
        return {
          type: "IO",
          text: node.text
        };
      }
      
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
      
    case "declaration":
      return {
        type: "Decl",
        text: node.text
      };
      
    case "class_specifier":
      // Ignore class definitions - they're boilerplate
      return null;
      
    case "namespace_definition":
      // Ignore namespace definitions - they're boilerplate
      return null;
      
    case "new_expression":
      // Handle C++ new operations (dynamic memory allocation)
      return {
        type: "New",
        text: node.text
      };
      
    case "delete_expression":
      // Handle C++ delete operations (dynamic memory deallocation)
      return {
        type: "Delete",
        text: node.text
      };
      
    case "try_statement":
      // Handle C++ try blocks
      return {
        type: "Try",
        text: node.text,
        body: node.child(1) ? normalizeCpp(node.child(1)) : null,  // try block body
        catch: node.child(2) ? normalizeCpp(node.child(2)) : null   // catch clause
      };
      
    case "catch_clause":
      // Handle C++ catch clauses
      return {
        type: "Catch",
        text: node.text,
        parameter: node.child(1)?.text || null,  // catch parameter
        body: node.child(2) ? normalizeCpp(node.child(2)) : null  // catch block body
      };
      
    case "throw_statement":
      // Handle C++ throw statements
      return {
        type: "Throw",
        text: node.text
      };
      
    case "switch_statement":
      // Handle switch statements
      return {
        type: "Switch",
        cond: normalizeCpp(node.child(1)), // condition is typically at index 1 (condition_clause)
        body: normalizeCpp(node.child(2)) // body is typically at index 2 (compound_statement)
      };
      
    case "case_statement":
      // Handle case statements (including default cases)
      // Check if this is actually a default case
      if (node.child(0)?.type === 'default') {
        // This is a default case
        return {
          type: "Default",
          body: node.children ? node.children.slice(2).map(normalizeCpp).filter(Boolean) : [] // Skip default and : tokens
        };
      } else {
        // This is a regular case
        return {
          type: "Case",
          value: node.child(1)?.text, // value is typically at index 1
          body: node.children ? node.children.slice(3).map(normalizeCpp).filter(Boolean) : [] // Skip case, value, and : tokens
        };
      }
      
    case "default":
      // Handle standalone default nodes (shouldn't occur in switch statements)
      return {
        type: "Default",
        body: []
      };
      
    case "break_statement":
      // Handle break statements
      return {
        type: "Break",
        text: "break"
      };
      
    case "call_expression":
      // Handle cout statements
      if (node.text && node.text.includes('cout')) {
        return {
          type: "IO",
          text: node.text
        };
      }
      // Handle cin statements
      if (node.text && node.text.includes('cin')) {
        return {
          type: "IO",
          text: node.text
        };
      }
      // Handle printf statements
      const functionCallee = node.child(0);
      if (functionCallee && functionCallee.text === 'printf') {
        return {
          type: "IO",
          text: node.text
        };
      }
      // Handle scanf statements
      if (functionCallee && functionCallee.text === 'scanf') {
        return {
          type: "IO",
          text: node.text
        };
      }
      // Handle general function calls
      return {
        type: "FunctionCall",
        text: node.text,
        name: functionCallee ? functionCallee.text : "unknown_function"
      };
      
    case "binary_expression":
      // Check if this binary expression contains function calls
      const functionCalls = [];
      
      // Recursively search for function calls in children
      function findFunctionCalls(n) {
        if (!n) return;
        
        if (n.type === 'call_expression') {
          const func = n.child(0);
          if (func && func.type === 'identifier') {
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
        exprNode.functionCalls = functionCalls;
      }
      
      return exprNode;
      
    case "return_statement":
      return {
        type: "Return",
        value: node.child(1)?.text || null
      };
      
    case "preproc_include":
      // Ignore #include directives - they're boilerplate
      return null;
      
    case "using_declaration":
      // Ignore using namespace statements - they're boilerplate
      return null;
      
    case "function_declarator":
      // Ignore function declarations - they're boilerplate
      return null;
      
    case "primitive_type":
      // Ignore primitive types when they appear as standalone nodes
      return null;
      
    case "identifier":
    case "number_literal":
    case "parenthesized_expression":
      // Check if this parenthesized expression contains function calls
      const parenFunctionCalls = [];
      
      // Recursively search for function calls in children
      function findParenFunctionCalls(n) {
        if (!n) return;
        
        if (n.type === 'call_expression') {
          const func = n.child(0);
          if (func && func.type === 'identifier') {
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
        parenExprNode.functionCalls = parenFunctionCalls;
      }
      
      return parenExprNode;

    case "comment":
      // Ignore comments - they shouldn't appear in flowcharts
      return null;
      
    default:
      // For simple nodes with text, convert to expression
      if (node.text) {
        return {
          type: "Expr",
          text: node.text
        };
      }
      return null;
  }
}

function isMainFunction(node) {
  if (!node?.name) return false;
  const name = node.name.toString().trim();
  return name === 'main';
}