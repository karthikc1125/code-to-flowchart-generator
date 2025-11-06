#include <stdio.h>

int min(int a, int b) {
    return (a < b) ? a : b;
}

int main() {
    int x = 15, y = 23;
    int minimum = min(x, y);
    printf("Minimum of %d and %d is %d\n", x, y, minimum);
    return 0;
}