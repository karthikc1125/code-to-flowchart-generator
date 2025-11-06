import { generateMermaid } from './src/index.mjs';

const code = `
#include <stdio.h>

int main() {
    char ch;
    
    printf("Enter a character: ");
    scanf(" %c", &ch);
    
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
        printf("%c is a Vowel\\n", ch);
    } else {
        printf("%c is a Consonant\\n", ch);
    }
    
    return 0;
}
`;

generateMermaid({ code, language: 'c' }).then(result => {
  console.log(result);
});