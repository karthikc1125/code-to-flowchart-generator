/**
 * Function declaration mapping for C language
 */

export function mapFunctionDeclaration(node) {
  // Map C function declaration to a standardized format
  return {
    type: 'Function',
    name: node.name || node.declarator?.name,
    params: node.parameters || node.declarator?.parameters || [],
    body: node.body || [],
    returnType: node.returnType || node.declarator?.returnType
  };
}