#include <stdio.h>

int main() {
    int n, sum = 0, i = 1;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &n);
        
        sum = 0;
        i = 1;
        
        do {
            sum += i;
            i++;
        } while (i <= n);
        
        printf("Sum of first %d natural numbers = %d\n", n, sum);
        
        printf("Do you want to calculate sum for another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}