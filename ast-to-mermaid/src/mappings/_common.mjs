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
    const line = `${id}{${escapeConditionalText(text)}}`;
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
    const line = `${id}{${escapeConditionalText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addElseIfStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeConditionalText(text)}}`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  function addSwitchStatement(key, text) {
    const id = nodeId(key);
    const line = `${id}{${escapeConditionalText(text)}}`;
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
    const line = `${id}{${escapeConditionalText(text)}}`;
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
    // Properly escape text for return statements
    const escapedText = escapeText(text);
    const line = `${id}>${escapedText}]`;
    if (currentSubgraph) {
      currentSubgraph.content.push(line);
    } else {
      lines.push(line);
    }
    return id;
  }

  // Add a join point for control flow merging
  function addJoinPoint(key, text = 'join') {
    const id = nodeId(key);
    const line = `${id}[${escapeText(text)}]`;
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
    addJoinPoint,
    beginSubgraph,
    endSubgraph,
    link, 
    linkToEnd,
    finalize,
    toString 
  };
}

function escapeText(text) {
  // Ensure all node strings are enclosed with double quotes as per requirement
  // In Mermaid, if text contains special characters, it should be enclosed in double quotes
  // and special characters within the text should be escaped
  // Rule: Inside the string we should not use " directly, escape them properly
  let escapedText = String(text)
    .replace(/"/g, '&quot;')   // Replace double quotes with HTML entity to avoid using " inside strings
    .replace(/\n/g, ' ')       // Replace newlines with spaces
    .trim();
  
  // Enclose all text with double quotes
  return `"${escapedText}"`;
}

// Special escape function for conditional statements that preserves operators
// Now deprecated since escapeText also preserves operators
function escapeConditionalText(text) {
  // For backward compatibility, just call escapeText
  return escapeText(text);
}

function escapeEdge(text) {
  // Properly escape edge labels for Mermaid syntax
  return String(text)
    .replace(/"/g, '\\"')   // Escape double quotes with backslash
    .replace(/--/g, '-')        // Handle Mermaid comment syntax
    .replace(/\n/g, ' ')       // Replace newlines with spaces
    .trim();
}

