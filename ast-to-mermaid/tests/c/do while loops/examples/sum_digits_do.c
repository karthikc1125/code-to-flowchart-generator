#include <stdio.h>

int main() {
    int number, sum = 0, remainder;
    int continueCalc;
    
    do {
        printf("Enter an integer: ");
        scanf("%d", &number);
        
        int temp = number;
        sum = 0;
        
        do {
            remainder = temp % 10;
            sum += remainder;
            temp /= 10;
        } while (temp != 0);
        
        printf("Sum of digits = %d\n", sum);
        
        printf("Do you want to calculate sum of digits for another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}