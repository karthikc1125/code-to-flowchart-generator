#include <stdio.h>

int main() {
    char str[100];
    int length = 0;
    
    printf("Enter a string: ");
    fgets(str, sizeof(str), stdin);
    
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] != '\n') {  // Don't count newline character
            length++;
        }
    }
    
    printf("Length of the string: %d\n", length);
    
    return 0;
}