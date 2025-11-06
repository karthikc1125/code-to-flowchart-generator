#include <stdio.h>

int main() {
    int number, reversed = 0, remainder;
    int continueCalc;
    
    do {
        printf("Enter an integer: ");
        scanf("%d", &number);
        
        int temp = number;
        reversed = 0;
        
        do {
            remainder = temp % 10;
            reversed = reversed * 10 + remainder;
            temp /= 10;
        } while (temp != 0);
        
        printf("Reversed number = %d\n", reversed);
        
        printf("Do you want to reverse another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}