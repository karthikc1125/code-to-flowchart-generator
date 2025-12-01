#include <stdio.h>

int calculate(int a, int b) {
    return a + b;
}

int main() {
    int result = calculate(5, 3);
    printf("Result: %d\n", result);
    return 0;
}