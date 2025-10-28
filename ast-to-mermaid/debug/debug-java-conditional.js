import { loadParserForLanguage } from './src/parser.mjs';
import { walkAst } from './src/walker.mjs';
import { normalizeTree } from './src/normalize.mjs';
import fs from 'fs';

const javaCode = fs.readFileSync('./tests/java/IfElifElseTest.java', 'utf8');

async function debug() {
  try {
    // Import the Java config to test our logic
    const { javaConfig } = await import('./src/mappings/java-config.mjs');
    
    const { parser, languageModule } = await loadParserForLanguage('java');
    const tree = parser.parse(javaCode);
    const normalized = normalizeTree(tree, languageModule);
    
    // Find the root node
    const nodeList = Array.isArray(normalized) ? normalized : Array.from(walkAst(normalized) || []);
    const rootNode = nodeList.find(n => n && javaConfig.rootNodeTypes.includes(n.type));
    
    if (!rootNode || !rootNode.children) {
      console.log('No root node found');
      return;
    }
    
    // Find statement nodes
    const candidateNodesRaw = typeof javaConfig.findStatementNodes === 'function'
      ? (javaConfig.findStatementNodes(rootNode) || [])
      : (rootNode.children || []);
    const candidateNodes = Array.isArray(candidateNodesRaw) ? candidateNodesRaw : Array.from(candidateNodesRaw || []);
    
    console.log(`Found ${candidateNodes.length} candidate nodes`);
    
    for (const node of candidateNodes) {
      if (!node) continue;
      
      // Check if this is a conditional statement
      if (javaConfig.isConditional && javaConfig.isConditional(node)) {
        console.log('\nFound conditional statement:');
        console.log('Type:', node.type);
        console.log('Text:', node.text);
        console.log('Children types:', node.children ? node.children.map(c => c.type) : 'No children');
        
        // Check for else and if_statement as siblings
        if (node.children) {
          const elseIndex = node.children.findIndex(c => c && c.type === 'else');
          const ifIndex = node.children.findIndex(c => c && c.type === 'if_statement');
          console.log('Else index:', elseIndex);
          console.log('If index:', ifIndex);
          
          if (elseIndex !== -1 && ifIndex !== -1 && ifIndex > elseIndex) {
            console.log('Found Java-style else if structure');
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

debug();