import { generateMermaid } from './src/index.mjs';

const code = `
#include <stdio.h>

int main() {
    char ch;
    int x = 5;  // This is a declaration with initialization
    int y;      // This is just a declaration
    
    ch = 'a';   // This is a pure assignment
    
    printf("Enter a character: ");
    scanf(" %c", &ch);
    
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
        printf("%c is a Vowel\\n", ch);
    } else {
        printf("%c is a Consonant\\n", ch);
    }
    
    y = 10;     // This is another pure assignment
    
    return 0;
}
`;

generateMermaid({ code, language: 'c' }).then(result => {
  console.log(result);
});