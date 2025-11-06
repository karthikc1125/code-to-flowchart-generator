#include <stdio.h>

int main() {
    int decimal, binary = 0, base = 1, remainder;
    int continueCalc;
    
    do {
        printf("Enter a decimal number: ");
        scanf("%d", &decimal);
        
        int temp = decimal;
        binary = 0;
        base = 1;
        
        do {
            remainder = temp % 2;
            binary += remainder * base;
            base *= 10;
            temp /= 2;
        } while (temp != 0);
        
        printf("Binary equivalent of %d = %d\n", decimal, binary);
        
        printf("Do you want to convert another decimal number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}