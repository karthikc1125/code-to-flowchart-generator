#include <stdio.h>

int power(int base, int exponent) {
    if (exponent < 0) {
        printf("Error: Negative exponents not supported!\n");
        return -1;
    }
    
    int result = 1;
    for (int i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

int main() {
    int base = 2, exponent = 8;
    int result = power(base, exponent);
    if (result != -1) {
        printf("%d raised to the power of %d is %d\n", base, exponent, result);
    }
    return 0;
}