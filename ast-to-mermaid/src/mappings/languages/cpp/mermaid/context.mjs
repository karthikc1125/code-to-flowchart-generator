// Context for Mermaid diagram generation
const createState = () => ({
  nodeId: 2,        // Start from 2 since N1 is reserved for start node
  subgraphId: 1,    // Counter for subgraphs
  subgraphNodeId: 1, // Counter for subgraph nodes
});

export function ctx(sharedState = null) {
  const state = sharedState || createState();

  const context = {
    state,
    nodes: [],
    edges: [],
    last: null,
    switchEndNodes: [],
    pendingBreaks: [],
    currentSwitchId: null,
    inLoop: false,
    loopContinueNode: null,
    deferredStatements: [],
    ifStack: [],
    pendingJoins: [],
    switchExecutedStatements: [],  // Track executed statements within switch cases,
    functionMap: {}, // Map of function names to their definitions
    subgraphIds: {}, // Map of function names to their subgraph IDs
    functionCalls: [], // Array to store function calls for later connection
    
    next() {
      return `N${state.nodeId++}`;
    },

    nextSubgraphId() {
      return `SG${state.subgraphId++}`;
    },
    
    nextSubgraphNode() {
      // Use a separate counter for subgraph nodes
      if (!state.subgraphNodeId) {
        state.subgraphNodeId = 1;
      }
      return `SGN${state.subgraphNodeId++}`;
    },
    
    add(id, label) {
      this.nodes.push(`${id}${label}`);
    },
    
    addEdge(from, to, label = null) {
      if (label) {
        this.edges.push(`${from} -- ${label} --> ${to}`);
      } else {
        this.edges.push(`${from} --> ${to}`);
      }
    },
    
    setLast(id) {
      this.last = id;
    },

    fork() {
      return ctx(state);
    },

    addRaw(line) {
      this.nodes.push(line);
    },

    addSubgraph(label, lines = []) {
      this.nodes.push(`subgraph ${label}`);
      lines.forEach(line => this.nodes.push(`  ${line}`));
      this.nodes.push('end');
    },

    // Add function to create connections between function calls and definitions
    createFunctionConnections() {
      // Keep track of connections we've already made to avoid duplicates
      const existingConnections = new Set();
      
      // Helper function to add a connection if it doesn't already exist
      const addConnection = (from, to) => {
        const connectionKey = `${from} <--> ${to}`;
        if (!existingConnections.has(connectionKey)) {
          existingConnections.add(connectionKey);
          this.edges.push(connectionKey);
        }
      };
      
      // First handle explicitly stored function calls
      if (this.functionCalls && this.subgraphIds) {
        this.functionCalls.forEach(callInfo => {
          const functionName = callInfo.functionName;
          const callId = callInfo.callId;
          
          if (this.subgraphIds[functionName]) {
            const subgraphId = this.subgraphIds[functionName];
            // Add a bidirectional connection from the function call to the subgraph
            addConnection(callId, subgraphId);
          }
        });
      }
      
      // Then scan through all nodes to find function calls in node texts
      if (this.subgraphIds && this.nodes) {
        // Create a map of function names to subgraph IDs for quick lookup
        const functionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
        
        this.nodes.forEach(nodeLine => {
          // Check if this is a regular node (not a subgraph declaration)
          if (nodeLine.startsWith('N') && !nodeLine.startsWith('subgraph')) {
            // Extract the node ID (e.g., N5)
            const nodeIdMatch = nodeLine.match(/^N\d+/);
            if (nodeIdMatch) {
              const nodeId = nodeIdMatch[0];
              
              // Look for function calls in the node text
              const nodeText = nodeLine.substring(nodeId.length);
              let match;
              while ((match = functionRegex.exec(nodeText)) !== null) {
                const functionName = match[1];
                
                // Skip common C functions that are not user-defined
                if (['if', 'for', 'while', 'switch', 'return', 'break', 'continue', 'sizeof'].includes(functionName)) {
                  continue;
                }
                
                // Check if this is a user-defined function
                if (this.subgraphIds[functionName]) {
                  const subgraphId = this.subgraphIds[functionName];
                  // Add a bidirectional connection from the node to the subgraph
                  addConnection(nodeId, subgraphId);
                }
              }
            }
          }
        });
      }
    },

    completeBranches() {
      // Placeholder for legacy calls. Branch handling now occurs via join queue.
    },

    // --- If handling helpers ------------------------------------------------
    registerIf(conditionId, hasElse) {
      const frame = {
        conditionId,
        hasElse,
        then: { started: false, last: null },
        else: { started: false, last: null },
        activeBranch: null
      };
      this.ifStack.push(frame);
      return frame;
    },

    currentIf() {
      return this.ifStack[this.ifStack.length - 1] || null;
    },

    enterBranch(type) {
      const frame = this.currentIf();
      if (!frame) return;
      frame.activeBranch = type === 'else' ? 'else' : 'then';
    },

    exitBranch(type) {
      const frame = this.currentIf();
      if (!frame) return;
      if (frame.activeBranch === type) {
        frame.activeBranch = null;
      }
    },

    handleBranchConnection(nodeId, { skipEdge = false } = {}) {
      const frame = this.currentIf();
      if (!frame || !frame.activeBranch) return false;

      const branchInfo = frame[frame.activeBranch];
      if (!skipEdge) {
        if (!branchInfo.started) {
          const label = frame.activeBranch === 'then' ? 'Yes' : 'No';
          this.addEdge(frame.conditionId, nodeId, label);
        } else if (branchInfo.last) {
          this.addEdge(branchInfo.last, nodeId);
        }
      }

      branchInfo.started = true;
      branchInfo.last = nodeId;
      this.last = nodeId;
      return true;
    },

    completeIf() {
      const frame = this.ifStack.pop();
      if (!frame) return null;
      this.queueJoinForFrame(frame);
      
      // Check if this if was inside a parent if's branch
      const parentFrame = this.currentIf();
      if (parentFrame && parentFrame.activeBranch) {
        const parentBranch = parentFrame[parentFrame.activeBranch];
        // If the parent branch's last node is this if's condition,
        // it means this if was the first statement in the parent's branch.
        // Update the parent branch to have no single last node since joins are queued.
        if (parentBranch.last === frame.conditionId) {
          parentBranch.last = null;
        }
      }
      
      // Don't leave ctx.last pointing to this if's condition node
      // because that would cause the parent to think the branch ends at the condition
      // Instead, set it to null to indicate no single last node (joins are queued)
      this.last = null;
      
      return frame;
    },

    queueJoinForFrame(frame) {
      const edges = [];

      if (frame.then.last) {
        edges.push({ from: frame.then.last, label: null });
      } else {
        edges.push({ from: frame.conditionId, label: 'Yes' });
      }

      if (frame.hasElse) {
        if (frame.else.last) {
          edges.push({ from: frame.else.last, label: null });
        } else if (frame.else.started) {
          // Else branch was started but has no last node.
          // This means it contains only control flow structures (nested ifs)
          // that have queued their own joins. Don't add an edge from condition.
        } else {
          // Else branch was never started (empty), edge from condition
          edges.push({ from: frame.conditionId, label: 'No' });
        }
      } else {
        edges.push({ from: frame.conditionId, label: 'No' });
      }

      this.pendingJoins.push({ edges });
    },

    resolvePendingJoins(targetId) {
      if (!this.pendingJoins || this.pendingJoins.length === 0) return false;
      const joins = this.pendingJoins.splice(0);
      joins.forEach(join => {
        join.edges.forEach(({ from, label }) => {
          if (!from) return;
          if (label) {
            this.addEdge(from, targetId, label);
          } else {
            this.addEdge(from, targetId);
          }
        });
      });
      return joins.length > 0;
    },

    completeSwitch() {
      // Collect all edges that should connect to the next statement after switch
      const edges = [];
      
      // Current switch level is the length of switchEndNodes array minus 1
      // (since we push a placeholder when entering switch)
      const currentSwitchLevel = (this.switchEndNodes?.length || 1) - 1;
      
      // Add pending breaks from this switch level
      if (this.pendingBreaks && this.pendingBreaks.length > 0) {
        const switchBreaks = this.pendingBreaks.filter(
          b => b.switchLevel === currentSwitchLevel
        );
        
        // Remove processed breaks
        this.pendingBreaks = this.pendingBreaks.filter(
          b => b.switchLevel !== currentSwitchLevel
        );
        
        // Add break edges
        switchBreaks.forEach(b => {
          edges.push({ from: b.breakId, label: null });
        });
      }
      
      // Add the last node if it exists (default case without break, or last case without break)
      if (this.last) {
        edges.push({ from: this.last, label: null });
      }
      
      // Queue all edges as pending joins
      if (edges.length > 0) {
        this.pendingJoins.push({ edges });
      }
      
      // Pop the switch end node placeholder
      if (this.switchEndNodes && this.switchEndNodes.length > 0) {
        this.switchEndNodes.pop();
      }
      
      // Clear the current switch ID and last pointer
      this.currentSwitchId = null;
      this.last = null;
    },
    
    emit() {
      // Create function connections before emitting
      if (typeof this.createFunctionConnections === 'function') {
        this.createFunctionConnections();
      }
      
      return [
        'flowchart TD',
        ...this.nodes,
        ...this.edges
      ].join('\n');
    }
  };
  
  return context;
}