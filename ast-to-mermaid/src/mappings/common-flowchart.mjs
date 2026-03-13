import { createFlowBuilder } from './_common.mjs';
import { isComplexBlock, processComplexBlock } from './statements/smart-conditional-loops.mjs';

// Utility function to get text from a node
function textOf(node) {
  return node?.text || '';
}

// Utility function to recursively process a list of statements
export function processStatements(statements, flow, languageConfig, last, initialLabel = undefined, isElseIf = false) {
  let currentLast = last;
  let isFirst = true;

  for (const stmt of statements) {
    if (!stmt) continue;

    const currentLabel = isFirst ? initialLabel : undefined;

    // 5. Complex Blocks (Conditionals & Loops) N-Depth
    if (isComplexBlock(stmt, languageConfig)) {
      const checkElseIf = isFirst ? isElseIf : false;
      const result = processComplexBlock(stmt, flow, languageConfig, currentLast, currentLabel, processStatements, checkElseIf);
      currentLast = result.last;
      isFirst = false;
      continue;
    }

    isFirst = false;

    // 1. Input operations
    if (languageConfig.isInputCall && languageConfig.isInputCall(stmt)) {
      const info = languageConfig.extractInputInfo ? languageConfig.extractInputInfo(stmt) : { prompt: '' };
      const labelText = info && info.prompt ? `read input: ${info.prompt}` : 'read input';
      const id = flow.addInputOutput(stmt, labelText);
      flow.link(currentLast, id, currentLabel);
      currentLast = id;
      continue;
    }

    // 2. Output calls
    if (languageConfig.isOutputCall && languageConfig.isOutputCall(stmt)) {
      const info = languageConfig.extractOutputInfo(stmt);
      if (info) {
        const labelText = info.arg ? `${info.function} ${info.arg}` : info.function;
        const id = flow.addInputOutput(stmt, labelText);
        flow.link(currentLast, id, currentLabel);
        currentLast = id;
      }
      continue;
    }

    // 3. Generic function calls
    if (languageConfig.isFunctionCall && languageConfig.isFunctionCall(stmt)) {
      const info = languageConfig.extractFunctionCallInfo(stmt);
      if (info && info.name) {
        const labelText = info.args ? `${info.name}(${info.args})` : `${info.name}()`;
        const id = flow.addAction(stmt, labelText);
        flow.link(currentLast, id, currentLabel);
        currentLast = id;
      }
      continue;
    }

    // 4. Expression statements containing calls
    if (stmt.type === 'expression_statement' && stmt.children) {
      const callExpr = stmt.children.find(c => c && (c.type === 'call_expression' || c.type === 'method_invocation' || c.type === 'call' || c.type === 'function_call'));
      if (callExpr && languageConfig.isFunctionCall && languageConfig.isFunctionCall(callExpr)) {
        const info = languageConfig.extractFunctionCallInfo(callExpr);
        if (info && info.name) {
          const labelText = info.args ? `${info.name}(${info.args})` : `${info.name}()`;
          const id = flow.addAction(callExpr, labelText);
          flow.link(currentLast, id, currentLabel);
          currentLast = id;
        }
        continue;
      }
    }

    // 7. Assignments
    if (languageConfig.isAssignment && languageConfig.isAssignment(stmt)) {
      const info = languageConfig.extractVariableInfo(stmt);
      if (info && (info.name || info.value)) {
        const labelText = `${info.name ?? ''} = ${info.value ?? ''}`.trim();
        const id = flow.addAction(stmt, labelText);
        flow.link(currentLast, id, currentLabel);
        currentLast = id;
      }
      continue;
    }

    // 8. Returns
    if (languageConfig.isReturnStatement && languageConfig.isReturnStatement(stmt)) {
      const info = languageConfig.extractReturnInfo(stmt);
      const labelText = info.value ? `return ${info.value}` : 'return';
      const id = flow.addReturnStatement(stmt, labelText);
      flow.link(currentLast, id, currentLabel);
      currentLast = id;
      continue;
    }

    // 9. Breaks
    if (languageConfig.isBreakStatement && languageConfig.isBreakStatement(stmt)) {
      const id = flow.addBreakStatement(stmt, 'break');
      flow.link(currentLast, id, currentLabel);
      currentLast = id;
      continue;
    }

    // 10. Continues
    if (languageConfig.isContinueStatement && languageConfig.isContinueStatement(stmt)) {
      const id = flow.addContinueStatement(stmt, 'continue');
      flow.link(currentLast, id, currentLabel);
      currentLast = id;
      continue;
    }
  }

  // console.log("processStatements generated last ID:", currentLast);
  return { last: currentLast };
}

// Common flowchart generation logic that works for any language
export function generateCommonFlowchart(nodes, languageConfig) {
  try {
    const flow = createFlowBuilder();
    const start = flow.addStart();

    // nodes may be a generator; normalize to an array first
    const nodeList = Array.isArray(nodes) ? nodes : Array.from(nodes || []);
    const rootNode = nodeList.find(n => n && languageConfig.rootNodeTypes.includes(n.type));

    if (!rootNode) {
      const end = flow.addEnd();
      flow.link(start, end);
      return flow.toString();
    }

    // Handle Function Definitions (Subgraphs)
    const functionNodes = nodeList.filter(n => languageConfig.isFunctionDefinition && languageConfig.isFunctionDefinition(n));
    for (const funcNode of functionNodes) {
      const funcName = languageConfig.extractFunctionName ? languageConfig.extractFunctionName(funcNode) : 'function';
      flow.beginSubgraph(funcNode, `Function: ${funcName}`);
      const funcBody = funcNode.children?.find(c => c && (c.type === 'compound_statement' || c.type === 'block' || c.type === 'statement_block'));
      if (funcBody && funcBody.children) {
        const funcStart = flow.addStart();
        const result = processStatements(funcBody.children, flow, languageConfig, funcStart);
        const funcEnd = flow.addEnd();
        flow.link(result.last, funcEnd);
      }
      flow.endSubgraph();
    }

    // Handle Main Execution Path
    const candidateNodesRaw = typeof languageConfig.findStatementNodes === 'function'
      ? (languageConfig.findStatementNodes(rootNode) || [])
      : (rootNode.children || []);
    const candidateNodes = Array.isArray(candidateNodesRaw) ? candidateNodesRaw : Array.from(candidateNodesRaw || []);

    const mainResult = processStatements(candidateNodes, flow, languageConfig, start);

    const end = flow.addEnd();
    flow.link(mainResult.last, end);
    flow.finalize(end);

    return flow.toString();
  } catch (error) {
    console.error('Error in common flowchart generation:', error);
    return 'flowchart TD\nA([start])\nB([end])\nA --> B';
  }
}