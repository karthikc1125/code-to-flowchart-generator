import { generateCommonFlowchart } from './common-flowchart.mjs';
import { typescriptConfig } from './typescript-config.mjs';

export function mapToMermaid(nodes, language = 'typescript') {
  try {
    return generateCommonFlowchart(nodes, typescriptConfig);
  } catch (error) {
    console.error('Error in TypeScript mapping:', error);
    return 'flowchart TD\nA([start])\nB([end])\nA --> B';
  }
}