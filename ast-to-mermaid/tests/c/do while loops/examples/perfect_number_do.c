#include <stdio.h>

int main() {
    int number, i, sum;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &number);
        
        sum = 0;
        i = 1;
        do {
            if (number % i == 0) {
                sum += i;
            }
            i++;
        } while (i < number);
        
        if (sum == number) {
            printf("%d is a perfect number\n", number);
        } else {
            printf("%d is not a perfect number\n", number);
        }
        
        printf("Do you want to check another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}