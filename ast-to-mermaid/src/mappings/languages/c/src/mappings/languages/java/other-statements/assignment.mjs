import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map assignment statement to Mermaid flowchart nodes
 * Creates process node for assignment operation
 * @param {Object} node - Normalized assignment node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapAssignment(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for assignment
  const assignId = ctx.next();
  
  // Generate appropriate text for the assignment
  let assignText = "assignment";
  if (node.text) {
    assignText = node.text;
  } else if (node.left && node.right) {
    // Handle Scanner input calls
    if (node.right.type === 'CallExpression' && node.right.callee && node.right.callee.property) {
      if (node.right.callee.property.name.startsWith('next')) {
        assignText = `${node.left.name} = read ${node.right.callee.property.name.substring(4).toLowerCase()}`;
      } else {
        assignText = `${node.left.name} = ${node.right.callee.property.name}`;
      }
    }
    // Handle arithmetic operations
    else if (node.right.type === 'BinaryExpression') {
      const left = node.left.name || node.left.text || "var";
      const rightLeft = node.right.left ? (node.right.left.name || node.right.left.text || "expr") : "expr";
      const rightRight = node.right.right ? (node.right.right.name || node.right.right.text || "expr") : "expr";
      assignText = `${left} = ${rightLeft} ${node.right.operator} ${rightRight}`;
    } 
    // Handle literals
    else if (node.right.type === 'Literal') {
      assignText = `${node.left.name} = ${node.right.value}`;
    }
    // Handle identifiers
    else if (node.right.type === 'Identifier') {
      assignText = `${node.left.name} = ${node.right.name}`;
    }
    // Handle update expressions
    else if (node.right.type === 'UpdateExpression') {
      const argText = node.right.argument.name || node.right.argument.text || "expr";
      const updateText = node.right.prefix ? `${node.right.operator}${argText}` : `${argText}${node.right.operator}`;
      assignText = `${node.left.name} = ${updateText}`;
    }
    // Fallback
    else if (node.left.name) {
      assignText = `${node.left.name} = expression`;
    }
  }
  
  ctx.add(assignId, processShape(assignText));
  
  // Use branch handling if we're in an active branch, otherwise use sequential linking
  const handled = ctx.handleBranchConnection && ctx.handleBranchConnection(assignId);
  if (!handled) {
    linkNext(ctx, assignId);
  }
}