#include <stdio.h>

int multiply(int a, int b) {
    return a * b;
}

int main() {
    int x = 6, y = 8;
    int result = multiply(x, y);
    printf("Product of %d and %d is %d\n", x, y, result);
    return 0;
}