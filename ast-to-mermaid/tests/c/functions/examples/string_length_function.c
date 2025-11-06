#include <stdio.h>

int stringLength(char str[]) {
    int length = 0;
    while (str[length] != '\0') {
        length++;
    }
    return length;
}

int main() {
    char str[] = "Hello, World!";
    int length = stringLength(str);
    printf("Length of string \"%s\" is %d\n", str, length);
    return 0;
}