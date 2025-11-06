import { generateMermaid } from './src/index.mjs';

const code = `
public class Test {
    public static void main(String[] args) {
        int x = 5;           // Regular variable with initialization
        int y;               // Regular variable without initialization
        char ch = 'a';       // Char variable with initialization
        String str;          // String without initialization
        
        System.out.println("Testing variable declarations");
        
        return;
    }
}
`;

generateMermaid({ code, language: 'java' }).then(result => {
  console.log(result);
});