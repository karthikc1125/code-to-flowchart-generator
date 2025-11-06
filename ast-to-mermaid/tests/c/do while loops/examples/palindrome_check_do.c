#include <stdio.h>

int main() {
    int number, reversed = 0, remainder, original;
    int continueCalc;
    
    do {
        printf("Enter an integer: ");
        scanf("%d", &number);
        
        original = number;
        int temp = number;
        reversed = 0;
        
        do {
            remainder = temp % 10;
            reversed = reversed * 10 + remainder;
            temp /= 10;
        } while (temp != 0);
        
        if (original == reversed) {
            printf("%d is a palindrome.\n", original);
        } else {
            printf("%d is not a palindrome.\n", original);
        }
        
        printf("Do you want to check another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}