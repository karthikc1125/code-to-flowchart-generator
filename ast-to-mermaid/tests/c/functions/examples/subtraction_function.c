#include <stdio.h>

int subtract(int a, int b) {
    return a - b;
}

int main() {
    int x = 10, y = 4;
    int result = subtract(x, y);
    printf("Difference of %d and %d is %d\n", x, y, result);
    return 0;
}