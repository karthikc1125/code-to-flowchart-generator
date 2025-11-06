#include <stdio.h>

int main() {
    int base, exponent, result = 1, i = 1;
    
    printf("Enter base: ");
    scanf("%d", &base);
    printf("Enter exponent: ");
    scanf("%d", &exponent);
    
    do {
        result *= base;
        i++;
    } while (i <= exponent);
    
    printf("%d raised to the power of %d is %d\n", base, exponent, result);
    
    return 0;
}