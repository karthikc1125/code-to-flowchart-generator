// Test C switch statement
#include <stdio.h>

int main() {
    int x = 2;

    switch (x) {
        case 1:
            printf("One");
            break;
        case 2:
            printf("Two");
            break;
        default:
            printf("Other");
    }

    printf("End of program");
    return 0;
}