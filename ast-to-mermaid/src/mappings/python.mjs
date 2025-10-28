import { generateCommonFlowchart } from './common-flowchart.mjs';
import { pythonConfig } from './python-config.mjs';

export function mapToMermaid(nodes, language = 'python') {
  return generateCommonFlowchart(nodes, pythonConfig);
}