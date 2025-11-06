#include <stdio.h>
#include <string.h>

int main() {
    char str1[] = "hello";
    char str2[] = "world";
    
    int result = strcmp(str1, str2);
    
    if (result == 0) {
        printf("Strings are equal.\n");
    } else if (result < 0) {
        printf("'%s' comes before '%s' alphabetically.\n", str1, str2);
    } else {
        printf("'%s' comes after '%s' alphabetically.\n", str1, str2);
    }
    
    return 0;
}