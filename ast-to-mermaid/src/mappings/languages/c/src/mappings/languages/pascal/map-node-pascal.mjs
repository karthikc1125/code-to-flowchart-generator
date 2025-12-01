/**
 * Map Pascal AST nodes to Mermaid diagram elements
 */

import { mapIf } from './conditional/if.mjs';
import { mapCase, mapCaseOption, mapElseCase } from './conditional/switch/switch.mjs';
import { mapFor } from './loops/for.mjs';
import { mapWhile } from './loops/while.mjs';
import { mapRepeat } from './loops/repeat.mjs';
import { mapDoWhile } from './loops/do-while.mjs';
import { shapes } from './mermaid/shapes.mjs';

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

/**
 * Map a Pascal AST node to Mermaid diagram elements
 * @param {Object} node - Pascal AST node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNodePascal(node, ctx) {
  if (!node || !ctx) return;

  // Handle different node types
  switch (node.type) {
    case 'if':
    case 'ifElse':
      // This is a raw AST node from tree-sitter, we need to map it properly
      mapIf({
        type: 'If',
        cond: { text: getConditionText(node) },
        then: getChildByType(node, 'statement'),
        else: hasElseClause(node) ? getChildByType(node, 'statement') : null
      }, ctx);
      break;
      
    case 'for':
      // Handle for loop
      mapFor({
        type: 'For',
        start: { text: getForStartText(node) },
        direction: { text: getForDirection(node) },
        end: { text: getForEndText(node) }
      }, ctx);
      break;
      
    case 'while':
      // Handle while loop
      mapWhile({
        type: 'While',
        cond: { text: getConditionText(node) }
      }, ctx);
      break;
      
    case 'repeat':
      // Handle repeat-until loop
      mapRepeat({
        type: 'Repeat',
        cond: { text: getConditionText(node) }
      }, ctx);
      break;
      
    case 'do':
      // Handle do-while loop (if exists in Pascal)
      mapDoWhile({
        type: 'DoWhile',
        cond: { text: getConditionText(node) }
      }, ctx);
      break;
      
    case 'case_statement':
      mapCase({
        type: 'Case',
        cond: { text: getConditionText(node) }
      }, ctx);
      break;
      
    case 'case_item':
      mapCaseOption({
        type: 'CaseOption',
        value: getNodeText(getChildByFieldName(node, 'value'))
      }, ctx);
      break;
      
    case 'else_clause':
      mapElseCase({
        type: 'ElseCase'
      }, ctx);
      break;
      
    case 'exprCall':
      // Handle procedure calls like writeln
      const callId = ctx.next();
      const procName = getNodeText(getChildByType(node, 'identifier'));
      const argsNode = getChildByType(node, 'exprArgs');
      const args = argsNode ? getNodeText(argsNode) : '';
      
      // Use IO shape for input/output operations like writeln, readln, etc.
      // Use process shape for other procedure calls
      const isIOOperation = procName === 'writeln' || procName === 'write' || 
                           procName === 'readln' || procName === 'read';
      const shape = isIOOperation ? ioShape(`${procName}(${args})`) : processShape(`${procName}(${args})`);
      
      ctx.add(callId, shape);
      
      // Link to previous node
      if (ctx.last) {
        ctx.addEdge(ctx.last, callId);
      }
      ctx.last = callId;
      break;
      
    case 'statement':
      // Handle statement nodes by processing their children
      // This is a container node, so we don't create a node for it
      // but we need to process its children
      // We don't break here, we let it fall through to default to process children
      // But we also want to ensure we process the children properly
      // Since this is handled by the walker, we don't need to do anything here
      break;
      
    default:
      // For other node types, we can create a generic representation or skip them
      // For debugging purposes, we might want to show unknown nodes
      /*
      const unknownId = ctx.next();
      ctx.add(unknownId, processShape(`[${node.type}]`));
      
      if (ctx.last) {
        ctx.addEdge(ctx.last, unknownId);
      }
      ctx.last = unknownId;
      */
      break;
  }
}

/**
 * Get the text content of a node
 * @param {Object} node - Tree-sitter node
 * @returns {string} Text content of the node
 */
function getNodeText(node) {
  if (!node) return '';
  return node.text || '';
}

/**
 * Get condition text from an if statement
 * @param {Object} node - Tree-sitter node
 * @returns {string} Condition text
 */
function getConditionText(node) {
  // For repeat loops, look specifically for the condition after kUntil
  if (node.type === 'repeat') {
    // Look for kUntil and then the exprBinary after it
    let foundUntil = false;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type === 'kUntil') {
        foundUntil = true;
        continue;
      }
      
      if (foundUntil && child && child.type === 'exprBinary') {
        return child.text || 'condition';
      }
    }
    return 'condition';
  }
  
  // For other nodes, look for exprBinary node which contains the condition
  return findChildTextByType(node, 'exprBinary') || 'condition';
}

/**
 * Find child node by type
 * @param {Object} node - Parent node
 * @param {string} type - Type to search for
 * @returns {Object|null} Child node or null
 */
function getChildByType(node, type) {
  if (!node || !node.childCount) return null;
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === type) {
      return child;
    }
  }
  
  return null;
}

/**
 * Find child node by field name
 * @param {Object} node - Parent node
 * @param {string} fieldName - Field name to search for
 * @returns {Object|null} Child node or null
 */
function getChildByFieldName(node, fieldName) {
  if (!node || !node.childCount) return null;
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    // Tree-sitter doesn't expose field names directly in JavaScript bindings
    // So we need to find the child based on position or type
    return child;
  }
  
  return null;
}

/**
 * Find text of child node by type
 * @param {Object} node - Parent node
 * @param {string} type - Type to search for
 * @returns {string} Text of child node or empty string
 */
function findChildTextByType(node, type) {
  if (!node || !node.childCount) return '';
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      if (child.type === type) {
        return child.text || '';
      }
      
      // Recursively search in children
      const result = findChildTextByType(child, type);
      if (result) {
        return result;
      }
    }
  }
  
  return '';
}

/**
 * Check if an if statement has an else clause
 * @param {Object} node - If statement node
 * @returns {boolean} True if has else clause
 */
function hasElseClause(node) {
  if (!node || !node.childCount) return false;
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === 'kElse') {
      return true;
    }
  }
  
  return false;
}

/**
 * Get for loop start text
 * @param {Object} node - For loop node
 * @returns {string} Start text
 */
function getForStartText(node) {
  // Look for assignment node which contains the start condition
  return findChildTextByType(node, 'assignment') || '';
}

/**
 * Get for loop direction (to/downto)
 * @param {Object} node - For loop node
 * @returns {string} Direction text
 */
function getForDirection(node) {
  // Look for kTo or kDownto nodes
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && (child.type === 'kTo' || child.type === 'kDownto')) {
      return child.text || '';
    }
  }
  return 'to';
}

/**
 * Get for loop end text
 * @param {Object} node - For loop node
 * @returns {string} End text
 */
function getForEndText(node) {
  // Look for the expression after kTo/kDownto
  let foundDirection = false;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && (child.type === 'kTo' || child.type === 'kDownto')) {
      foundDirection = true;
      continue;
    }
    
    if (foundDirection && child && (child.type === 'literalNumber' || child.type === 'identifier' || child.type === 'exprBinary')) {
      return child.text || '';
    }
  }
  return '';
}