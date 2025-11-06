#include <stdio.h>

void stringCopy(char source[], char destination[]) {
    int i = 0;
    while (source[i] != '\0') {
        destination[i] = source[i];
        i++;
    }
    destination[i] = '\0'; // Null terminate the destination string
}

int main() {
    char source[] = "Hello, World!";
    char destination[100];
    
    stringCopy(source, destination);
    printf("Source: %s\n", source);
    printf("Destination: %s\n", destination);
    return 0;
}