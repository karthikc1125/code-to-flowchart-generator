#include <stdio.h>
#include <math.h>

int main() {
    long long binary, decimal = 0, base = 1, remainder;
    
    printf("Enter a binary number: ");
    scanf("%lld", &binary);
    
    long long temp = binary;
    while (temp > 0) {
        remainder = temp % 10;
        decimal += remainder * base;
        base *= 2;
        temp /= 10;
    }
    
    printf("Decimal equivalent of %lld = %lld\n", binary, decimal);
    
    return 0;
}