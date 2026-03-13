import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import C from 'tree-sitter-c';
import Cpp from 'tree-sitter-cpp';
import Java from 'tree-sitter-java';
import Python from 'tree-sitter-python';
import TypeScript from 'tree-sitter-typescript';

import { generateCommonFlowchart } from './src/mappings/common-flowchart.mjs';
import { normalizeTree } from './src/normalize.mjs';

import { javascriptConfig } from './src/mappings/javascript-config.mjs';
import { cConfig } from './src/mappings/c-config.mjs';
import { cppConfig } from './src/mappings/cpp-config.mjs';
import { javaConfig } from './src/mappings/java-config.mjs';
import { pythonConfig } from './src/mappings/python-config.mjs';

function testDoWhile(Language, config, code, langName) {
    const parser = new Parser();
    parser.setLanguage(Language);
    const tree = parser.parse(code);
    const normalizedNode = normalizeTree(tree);
    
    console.log(`\nGenerating flowchart for ${langName}...`);
    try {
        const mermaidCode = generateCommonFlowchart([normalizedNode], config);
        console.log(`[OK] Generated flowchart.`);
        console.log(mermaidCode);
    } catch (e) {
        console.error(`[ERROR] Failed to generate flowchart for ${langName}:`, e);
    }
}

// 1. JavaScript
testDoWhile(JavaScript, javascriptConfig, `
let i = 0;
do {
    console.log(i);
    i++;
} while (i < 5);
`, "JavaScript");

// 2. C
testDoWhile(C, cConfig, `
int main() {
    int i = 0;
    do {
        printf("%d", i);
        i++;
    } while (i < 5);
    return 0;
}
`, "C");

// 3. C++
testDoWhile(Cpp, cppConfig, `
int main() {
    int i = 0;
    do {
        cout << i << endl;
        i++;
    } while (i < 5);
    return 0;
}
`, "C++");

// 4. Java
testDoWhile(Java, javaConfig, `
public class Main {
    public static void main(String[] args) {
        int i = 0;
        do {
            System.out.println(i);
            i++;
        } while (i < 5);
    }
}
`, "Java");

// 5. Python (has no do-while natively, use 'while True: ... if condition: break')
testDoWhile(Python, pythonConfig, `
i = 0
while True:
    print(i)
    i += 1
    if not (i < 5):
        break
`, "Python");
