// Test C switch statement with break statements
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
            break;
    }

    printf("End of program");
    return 0;
}