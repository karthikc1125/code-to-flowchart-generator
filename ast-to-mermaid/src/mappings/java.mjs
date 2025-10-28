import { generateCommonFlowchart } from './common-flowchart.mjs';
import { javaConfig } from './java-config.mjs';

export function mapToMermaid(nodes, language = 'java') {
  return generateCommonFlowchart(nodes, javaConfig);
}