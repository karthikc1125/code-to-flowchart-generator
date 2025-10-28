// Utilities to build Mermaid flowcharts in a consistent way

export function createFlowBuilder() {
  let counter = 0;
  const lines = ["flowchart TD"]; 
  const ids = new Map();
  const pendingConnections = []; // Store connections that need to be made to the end node
  const subgraphs = new Map(); // Store subgraphs
  let currentSubgraph = null; // Track current subgraph

  function nodeId(key) {
    if (!ids.has(key)) ids.set(key, `N${++counter}`);
    return ids.get(key);
  }

  function addStart(label = 'start') {
    const id = nodeId('start');
    const line = `${id}([${label}])`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addEnd(label = 'end') {
    const id = nodeId('end');
    const line = `${id}([${label}])`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addAction(key, text) {
    const id = nodeId(key);
    const line = `${id}[${escapeText(text)}]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addInputOutput(key, text) {
    const id = nodeId(key);
    const line = `${id}[/` + escapeText(text) + `/]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addDecision(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  // New shape functions for different statement types
  
  function addIfStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addElseIfStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addSwitchStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addCaseStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}[${escapeText(text)}]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addLoopStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addContinueStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}[${escapeText(text)}]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addBreakStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}[${escapeText(text)}]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addReturnStatement(key, text) {
    const id = nodeId(key);
    // Only escape problematic characters but keep brackets for return statements
    const escapedText = String(text).replace(/[{}]/g, '').replace(/[()]/g, '');
    const line = `${id}>${escapedText}]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  // Subgraph functions
  
  function beginSubgraph(key, title) {
    const id = nodeId(key);
    const subgraph = {
      id: id,
      title: title,
      content: []
    };
    subgraphs.set(id, subgraph);
    currentSubgraph = subgraph;
    return id;
  }

  function endSubgraph() {
    if (currentSubgraph) {
      // Add the subgraph to the main lines
      lines.push(`subgraph ${currentSubgraph.id} [${escapeText(currentSubgraph.title)}]`);
      lines.push(...currentSubgraph.content);
      lines.push(`end`);
      currentSubgraph = null;
    }
  }

  function link(from, to, label) {
    const line = label ? `${from} --${escapeEdge(label)}--> ${to}` : `${from} --> ${to}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
  }

  function linkToEnd(from, label) {
    // Store connection to be made when end node is created
    pendingConnections.push({ from, label, type: 'end' });
  }

  function linkToNext(from, label) {
    // Store connection to be made when next node is created
    pendingConnections.push({ from, label, type: 'next' });
  }

  function finalize(endNodeId) {
    // Connect all pending connections to the end node
    for (const conn of pendingConnections) {
      if (conn.type === 'end') {
        link(conn.from, endNodeId, conn.label);
      }
      // For 'next' type connections, they should be handled in the main loop
    }
  }

  function toString() {
    return lines.join('\n');
  }

  return { 
    addStart, 
    addEnd, 
    addAction, 
    addInputOutput, 
    addDecision, 
    addIfStatement,
    addElseIfStatement,
    addSwitchStatement,
    addCaseStatement,
    addLoopStatement,
    addContinueStatement,
    addBreakStatement,
    addReturnStatement,
    beginSubgraph,
    endSubgraph,
    link, 
    linkToEnd,
    finalize,
    toString 
  };
}

function escapeText(text) {
  // Remove bracket-like chars and parentheses but leave a space in their place
  // Keep quotes intact so labels like "print \"HI\"" render properly
  return String(text)
    .replace(/\{/g, ' ')
    .replace(/\}/g, ' ')
    .replace(/\[/g, ' ')
    .replace(/\]/g, ' ')
    .replace(/\(/g, ' ')
    .replace(/\)/g, ' ')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeEdge(text) {
  return String(text).replace(/--/g, '-');
}

