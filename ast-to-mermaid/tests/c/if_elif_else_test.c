// Test C if/else if/else statements
#include <stdio.h>

int main() {
    int x = 10;

    if (x > 0) {
        printf("Positive number");
    } else if (x < 0) {
        printf("Negative number");
    } else {
        printf("Zero");
    }

    printf("End of program");
    return 0;
}