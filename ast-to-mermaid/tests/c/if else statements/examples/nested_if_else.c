#include <stdio.h>

int main() {
    int age = 25;
    int has_license = 1; // 1 for true, 0 for false
    
    if (age >= 18) {
        if (has_license) {
            printf("You can drive legally.\n");
        } else {
            printf("You need to get a license.\n");
        }
    } else {
        printf("You are too young to drive.\n");
    }
    
    return 0;
}