import { javaConfig } from './src/mappings/java-config.mjs';
import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

// Test nested loops
const sourceCode = `
public class NestedLoopTest {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            System.out.println("Outer loop: " + i);
            for (int j = 0; j < 2; j++) {
                System.out.println("Inner loop: " + j);
            }
            System.out.println("End of outer loop iteration");
        }
        System.out.println("All loops finished");
    }
}
`;

const parser = new Parser();
parser.setLanguage(Java);

const tree = parser.parse(sourceCode);
console.log('Generated Mermaid for nested loops:');
console.log(generateCommonFlowchart([tree.rootNode], javaConfig));