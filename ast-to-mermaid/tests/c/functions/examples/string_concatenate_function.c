#include <stdio.h>

void stringConcatenate(char str1[], char str2[]) {
    int i = 0, j = 0;
    
    // Find the end of str1
    while (str1[i] != '\0') {
        i++;
    }
    
    // Copy str2 to the end of str1
    while (str2[j] != '\0') {
        str1[i] = str2[j];
        i++;
        j++;
    }
    
    str1[i] = '\0'; // Null terminate the concatenated string
}

int main() {
    char str1[100] = "Hello, ";
    char str2[] = "World!";
    
    printf("Before concatenation: %s\n", str1);
    stringConcatenate(str1, str2);
    printf("After concatenation: %s\n", str1);
    return 0;
}