#include <stdio.h>

int main() {
    char str[1000];
    int i = 0, words = 0;
    int inWord = 0; // Flag to track if we're inside a word
    
    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);
    
    while (str[i] != '\0') {
        if (str[i] == ' ' || str[i] == '\t' || str[i] == '\n') {
            inWord = 0;
        } else if (inWord == 0) {
            inWord = 1;
            words++;
        }
        i++;
    }
    
    printf("Number of words in the string: %d\n", words);
    
    return 0;
}