#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

int isStrongNumber(int n) {
    int original = n;
    int sum = 0;
    
    while (n != 0) {
        int digit = n % 10;
        sum += factorial(digit);
        n /= 10;
    }
    
    return (sum == original) ? 1 : 0;
}

int main() {
    int number = 145;
    if (isStrongNumber(number)) {
        printf("%d is a strong number.\n", number);
    } else {
        printf("%d is not a strong number.\n", number);
    }
    return 0;
}