#include <stdio.h>

int factorial(int n) {
    if (n < 0) {
        printf("Error: Factorial of negative number is undefined!\n");
        return -1;
    }
    
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    int number = 5;
    int result = factorial(number);
    if (result != -1) {
        printf("Factorial of %d is %d\n", number, result);
    }
    return 0;
}