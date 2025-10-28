import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

// Test Java switch statement
const javaCode = `
public class SwitchTest {
    public static void main(String[] args) {
        int x = 2;
        switch (x) {
            case 1:
                System.out.println("One");
                break;
            case 2:
                System.out.println("Two");
                break;
            default:
                System.out.println("Other");
        }
        System.out.println("End of program");
    }
}
`;

function printAST(code, language, parser) {
    try {
        const tree = parser.parse(code);
        console.log(`${language} AST Root Type:`, tree.rootNode.type);
        console.log(`${language} AST Structure:`);
        printNode(tree.rootNode, 0);
    } catch (error) {
        console.error(`Error parsing ${language}:`, error.message);
    }
}

function printNode(node, depth) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type}: "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"`);
    
    if (node.type === 'switch_statement' || node.type.includes('switch') || node.type.includes('case')) {
        console.log(`${indent}>>> FOUND SWITCH/CASE NODE <<<`);
    }
    
    // Print all children, regardless of depth
    for (const child of node.children || []) {
        if (child) {
            printNode(child, depth + 1);
        }
    }
}

// Create parser
const javaParser = new Parser();
javaParser.setLanguage(Java);

console.log('=== JAVA SWITCH STATEMENT (FULL STRUCTURE) ===');
printAST(javaCode, 'Java', javaParser);