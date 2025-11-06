#include <stdio.h>

int isVowel(char ch) {
    // Convert to lowercase if uppercase
    if (ch >= 'A' && ch <= 'Z') {
        ch = ch + 32;
    }
    
    return (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') ? 1 : 0;
}

int main() {
    char ch = 'A';
    if (isVowel(ch)) {
        printf("'%c' is a vowel.\n", ch);
    } else {
        printf("'%c' is not a vowel.\n", ch);
    }
    return 0;
}