import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

// Test JavaScript switch statement
const jsCode = `
let x = 2;
switch (x) {
    case 1:
        console.log("One");
        break;
    case 2:
        console.log("Two");
        break;
    default:
        console.log("Other");
}
console.log("End of program");
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
const jsParser = new Parser();
jsParser.setLanguage(JavaScript);

console.log('=== JAVASCRIPT SWITCH STATEMENT (FULL STRUCTURE) ===');
printAST(jsCode, 'JavaScript', jsParser);