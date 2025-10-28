import { generateCommonFlowchart } from './common-flowchart.mjs';
import { javascriptConfig } from './javascript-config.mjs';

export function mapToMermaid(nodes, language = 'js') {
  return generateCommonFlowchart(nodes, javascriptConfig);
}







