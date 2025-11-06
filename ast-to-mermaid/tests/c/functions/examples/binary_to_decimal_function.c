#include <stdio.h>
#include <math.h>

int binaryToDecimal(long long n) {
    int decimal = 0, i = 0, remainder;
    
    while (n != 0) {
        remainder = n % 10;
        n /= 10;
        decimal += remainder * pow(2, i);
        i++;
    }
    
    return decimal;
}

int main() {
    long long binary = 1010;
    int decimal = binaryToDecimal(binary);
    printf("Binary %lld in decimal is %d\n", binary, decimal);
    return 0;
}