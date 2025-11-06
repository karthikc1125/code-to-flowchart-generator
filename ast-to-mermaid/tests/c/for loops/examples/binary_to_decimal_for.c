#include <stdio.h>
#include <math.h>

int main() {
    long long binary, decimal = 0, base = 1, remainder;
    
    printf("Enter a binary number: ");
    scanf("%lld", &binary);
    
    for (long long temp = binary; temp != 0; temp /= 10) {
        remainder = temp % 10;
        decimal += remainder * base;
        base *= 2;
    }
    
    printf("Decimal equivalent = %lld\n", decimal);
    
    return 0;
}