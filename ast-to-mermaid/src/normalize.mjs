// Produce a lightweight, language-agnostic normalized AST structure
// Node: { type, text, children: NormalizedNode[], named: boolean }

export function normalizeTree(tree, languageModule) {
  if (!tree || !tree.rootNode) {
    return { type: 'error', text: '', named: false, children: [] };
  }
  const root = tree.rootNode;
  return normalizeNode(root);
}

function normalizeNode(node) {
  if (!node) {
    return { type: 'error', text: '', named: false, children: [] };
  }
  
  const normalized = {
    type: node.type || 'unknown',
    text: (node.isNamed && node.text) ? node.text : '',
    named: Boolean(node.isNamed),
    children: [],
  };
  
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child) {
        normalized.children.push(normalizeNode(child));
      }
    }
  }
  
  return normalized;
}

