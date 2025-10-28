import { generateMermaid } from './src/index.mjs';

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

async function test() {
  try {
    const result = await generateMermaid({ code: javaCode, language: 'java' });
    console.log('Java Mermaid Output:');
    console.log(result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();