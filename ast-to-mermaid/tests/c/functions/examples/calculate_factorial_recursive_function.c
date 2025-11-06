#include <stdio.h>

int factorialRecursive(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorialRecursive(n - 1);
}

int main() {
    int number = 5;
    int result = factorialRecursive(number);
    printf("Factorial of %d (recursive) is %d\n", number, result);
    return 0;
}