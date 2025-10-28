// A very small DFS walker that yields nodes; extensible with visitors later

export function* walkAst(node) {
  if (!node) return;
  yield node;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child) {
        yield* walkAst(child);
      }
    }
  }
}

