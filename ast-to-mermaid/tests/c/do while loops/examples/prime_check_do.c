#include <stdio.h>

int main() {
    int number, i, isPrime;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &number);
        
        if (number <= 1) {
            isPrime = 0;
        } else {
            isPrime = 1;
            i = 2;
            do {
                if (number % i == 0) {
                    isPrime = 0;
                    break;
                }
                i++;
            } while (i <= number/2);
        }
        
        if (isPrime) {
            printf("%d is a prime number.\n", number);
        } else {
            printf("%d is not a prime number.\n", number);
        }
        
        printf("Do you want to check another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}