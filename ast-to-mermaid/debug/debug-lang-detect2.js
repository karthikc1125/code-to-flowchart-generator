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

console.log('Checking C++ markers individually:');
console.log('\\bstd::', /\bstd::/.test(javaCode));
console.log('cout\\s*<<', /cout\s*<</.test(javaCode));
console.log('cin\\s*>>', /cin\s*>>/.test(javaCode));
console.log('\\bclass\\s+\\w+', /\bclass\s+\w+/.test(javaCode));
console.log('namespace\\b', /namespace\b/.test(javaCode));

// The issue is that "String[" is matching the \bclass\s+\w+ pattern
console.log('String[ matches \\bclass\\s+\\w+:', /String\[/.test(javaCode));
console.log('String[ matches \\bclass\\s+\\w+:', /\bclass\s+\w+/.test('String['));