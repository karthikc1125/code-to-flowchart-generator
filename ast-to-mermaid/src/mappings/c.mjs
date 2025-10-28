import { generateCommonFlowchart } from './common-flowchart.mjs';
import { cConfig } from './c-config.mjs';

export function mapToMermaid(nodes, language = 'c') {
  return generateCommonFlowchart(nodes, cConfig);
}