import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

const parser = new Parser();
parser.setLanguage(JavaScript);

const code = `
let i = 0;
do {
    console.log(i);
    i++;
} while (i < 5);
console.log("Done!");
`;

const tree = parser.parse(code);
console.log("Generating flowchart for JavaScript...");
const normalizedNode = normalizeTree(tree);

const mermaidCode = generateCommonFlowchart([normalizedNode], javascriptConfig);

console.log("\n====== MERMAID CODE ======\n");
console.log(mermaidCode);
console.log("\n==========================\n");

fs.writeFileSync('test-dowhile-output.md', '\`\`\`mermaid\n' + mermaidCode + '\n\`\`\`\n');
console.log("Saved to test-dowhile-output.md");
