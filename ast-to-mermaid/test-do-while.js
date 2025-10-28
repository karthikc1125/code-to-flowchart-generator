import { javaConfig } from './src/mappings/java-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

// Test do-while loop
const sourceCode = `
public class DoWhileTest {
    public static void main(String[] args) {
        int i = 0;
        do {
            System.out.println("Iteration: " + i);
            i++;
        } while (i < 3);
        System.out.println("Loop finished");
    }
}
`;

const parser = new Parser();
parser.setLanguage(Java);

const tree = parser.parse(sourceCode);
console.log('Generated Mermaid for do-while loop:');
console.log(generateCommonFlowchart([tree.rootNode], javaConfig));