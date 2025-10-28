import { detectLanguage } from './src/language-detect.mjs';

const javaCode = `import java.util.Scanner;

public class InputPrint {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        scanner.close();
    }
}`;

console.log('Java code:');
console.log(javaCode);
console.log('\n');

// Manual check
const src = String(javaCode || '');
const trimmed = src.trim();
console.log('Trimmed code:');
console.log(trimmed);
console.log('\n');

// Check each condition
console.log('hasShebangPy:', /^#!.*python/.test(trimmed));
console.log('Java markers match:', /\bpublic\s+class\s+\w+|System\.out\.print|public\s+static\s+void\s+main\s*\(String\[\]|Scanner\s+\w+|\.nextInt\(|\.next\(/.test(trimmed));
console.log('C/C++ includes:', /^#include\s+</m.test(trimmed));
console.log('C markers:', /\bprintf\s*\(|\bscanf\s*\(|\bfprintf\s*\(|\bfscanf\s*\(|\bgetc\s*\(|\bputc\s*\(|\bfopen\s*\(|\bfclose\s*\(|\bmalloc\s*\(|\bfree\s*\(|\bstrlen\s*\(|\bstrcpy\s*\(|\bstrcat\s*\(/.test(trimmed));
console.log('C++ markers:', /\bstd::|cout\s*<<|cin\s*>>|\bclass\s+\w+|namespace\b/.test(trimmed));
console.log('TS markers:', /\binterface\s+\w+|\benum\s+\w+|:\s*\w+(<.*>)?\s*(=|;|,|\))/.test(trimmed));
console.log('JS markers:', /console\.log\(|export\s+(default\s+)?|import\s+.*from\s+['"][^'"]+['"]|=>/.test(trimmed));

console.log('\nDetected language:', detectLanguage(javaCode));