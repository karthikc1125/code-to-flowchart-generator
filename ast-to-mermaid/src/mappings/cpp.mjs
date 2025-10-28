import { generateCommonFlowchart } from './common-flowchart.mjs';
import { cppConfig } from './cpp-config.mjs';

export function mapToMermaid(nodes, language = 'cpp') {
  return generateCommonFlowchart(nodes, cppConfig);
}