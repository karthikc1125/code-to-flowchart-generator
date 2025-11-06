#include <stdio.h>
#include <math.h>

int main() {
    long long binary, decimal = 0, base = 1, remainder;
    int continueCalc;
    
    do {
        printf("Enter a binary number: ");
        scanf("%lld", &binary);
        
        long long temp = binary;
        decimal = 0;
        base = 1;
        
        do {
            remainder = temp % 10;
            decimal += remainder * base;
            base *= 2;
            temp /= 10;
        } while (temp != 0);
        
        printf("Decimal equivalent of %lld = %lld\n", binary, decimal);
        
        printf("Do you want to convert another binary number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}