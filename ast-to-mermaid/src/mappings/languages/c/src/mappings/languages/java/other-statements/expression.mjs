import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";
import { mapIoStatement } from "../io/io.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

// Helper function to generate text representation of a node
function generateNodeText(node) {
  if (!node) return "expression";
  
  switch (node.type) {
    case 'Literal':
      // Remove quotes from string literals
      if (typeof node.value === 'string') {
        return node.value;
      }
      return node.value;
    case 'Identifier':
      return node.name;
    case 'BinaryExpression':
      const leftText = generateNodeText(node.left);
      const rightText = generateNodeText(node.right);
      // For string concatenation
      if (node.operator === '+') {
        return `${leftText}${rightText}`;
      }
      return `${leftText} ${node.operator} ${rightText}`;
    case 'CallExpression':
      // Handle System.out.println/printf calls
      if (node.callee && node.callee.object && node.callee.object.name === 'System' &&
          node.callee.property && (node.callee.property.name === 'out')) {
        const methodName = node.callee.property.name;
        if (node.arguments && node.arguments.length > 0) {
          const argTexts = node.arguments.map(arg => generateNodeText(arg));
          return `${methodName} ${argTexts.join(", ")}`;
        }
        return methodName;
      }
      // Handle Scanner input calls
      if (node.callee && node.callee.object && node.callee.property) {
        if (node.callee.property.name.startsWith('next')) {
          return `read ${node.callee.property.name.substring(4).toLowerCase()}`;
        }
        return node.callee.property.name;
      }
      return node.text || "call expression";
    case 'UpdateExpression':
      const argText = generateNodeText(node.argument);
      return node.prefix ? `${node.operator}${argText}` : `${argText}${node.operator}`;
    case 'AssignmentExpression':
      const left = generateNodeText(node.left);
      const right = generateNodeText(node.right);
      return `${left} ${node.operator} ${right}`;
    default:
      return node.text || "expression";
  }
}

/**
 * Map expression statement to Mermaid flowchart nodes
 * Creates process node for expression evaluation
 * @param {Object} node - Normalized expression node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapExpr(node, ctx) {
  if (!node || !ctx) return;
  
  // Check if this is a System.out.print/println statement
  if (node.expression && node.expression.type === 'CallExpression' &&
      node.expression.callee && node.expression.callee.object && 
      node.expression.callee.object.name === 'System' &&
      node.expression.callee.property && 
      (node.expression.callee.property.name === 'out')) {
    // Create IO node directly for System.out statements
    const ioId = ctx.next();
    
    // Generate appropriate text for the IO operation
    // Use the full text from normalization which includes System.out.println prefix
    let ioText = node.expression.text || "System.out.print output";
    if (node.expression.arguments && node.expression.arguments.length > 0) {
      // If we have the full text from normalization, use it
      if (node.expression.text) {
        ioText = node.expression.text;
      } else {
        // Handle print/println with arguments
        const argTexts = node.expression.arguments.map(arg => generateNodeText(arg));
        // Format according to reference: "Print: message" or just "message"
        const message = argTexts.join(", ");
        // If this looks like a prompt (no variable references), format as prompt
        // If this looks like output with variable, format as "Print: message"
        if (message.includes(": ") && message.includes("You entered")) {
          ioText = `Print: ${message}`;
        } else {
          ioText = message;
        }
      }
    }
    
    ctx.add(ioId, ioShape(ioText));
    
    // Use branch handling if we're in an active branch, otherwise use sequential linking
    const handled = ctx.handleBranchConnection && ctx.handleBranchConnection(ioId);
    if (!handled) {
      linkNext(ctx, ioId);
    }
    return;
  }
  
  // Create process node for expression
  const exprId = ctx.next();
  
  // Generate appropriate text for the expression
  let exprText = "expression";
  
  // Handle CallExpression (like System.out.print/println)
  if (node.expression && node.expression.type === 'CallExpression') {
    if (node.expression.arguments && node.expression.arguments.length > 0) {
      // Handle System.out.print/println with arguments
      const argTexts = node.expression.arguments.map(arg => generateNodeText(arg));
      const prefix = node.expression.callee && node.expression.callee.property ? 
                     node.expression.callee.property.name : "print";
      exprText = `${prefix} ${argTexts.join(", ")}`;
    } else if (node.expression.callee && node.expression.callee.property) {
      if (node.expression.callee.property.name === 'out') {
        exprText = "print output";
      } else if (node.expression.callee.property.name.startsWith('next')) {
        exprText = `read ${node.expression.callee.property.name.substring(4).toLowerCase()}`;
      } else {
        exprText = node.expression.callee.property.name;
      }
    } else if (node.expression.text) {
      exprText = node.expression.text;
    } else {
      exprText = generateNodeText(node.expression);
    }
  }
  // Handle binary expressions (arithmetic operations)
  else if (node.expression && node.expression.type === 'BinaryExpression') {
    exprText = generateNodeText(node.expression);
  }
  // Handle assignment expressions
  else if (node.expression && node.expression.type === 'AssignmentExpression') {
    exprText = generateNodeText(node.expression);
  }
  // Handle update expressions (increment/decrement)
  else if (node.expression && node.expression.type === 'UpdateExpression') {
    exprText = generateNodeText(node.expression);
  }
  // Handle identifiers
  else if (node.expression && node.expression.type === 'Identifier') {
    exprText = node.expression.name;
  }
  // Handle literals
  else if (node.expression && node.expression.type === 'Literal') {
    exprText = generateNodeText(node.expression);
  }
  // Fallback to node text
  else if (node.text) {
    exprText = node.text;
  }
  
  // For IO operations, use parallelogram shape; otherwise use rectangle
  let shape;
  if (node.expression && node.expression.type === 'CallExpression' &&
      node.expression.callee && node.expression.callee.object && 
      node.expression.callee.object.name === 'System') {
    shape = ioShape(exprText);
  } else {
    shape = processShape(exprText);
  }
  
  ctx.add(exprId, shape);
  
  // Connect to previous node and set as last
  linkNext(ctx, exprId);
}