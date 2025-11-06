#include <stdio.h>

int main() {
    int number, factorial = 1, i = 1;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &number);
        
        if (number < 0) {
            printf("Factorial is not defined for negative numbers.\n");
        } else {
            factorial = 1;
            i = 1;
            do {
                factorial *= i;
                i++;
            } while (i <= number);
            
            printf("Factorial of %d = %d\n", number, factorial);
        }
        
        printf("Do you want to calculate another factorial? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}