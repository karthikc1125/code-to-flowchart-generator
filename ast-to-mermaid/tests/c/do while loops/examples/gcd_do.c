#include <stdio.h>

int main() {
    int num1, num2, gcd, i;
    int continueCalc;
    
    do {
        printf("Enter two integers: ");
        scanf("%d %d", &num1, &num2);
        
        i = 1;
        do {
            if (num1 % i == 0 && num2 % i == 0) {
                gcd = i;
            }
            i++;
        } while (i <= num1 && i <= num2);
        
        printf("GCD of %d and %d is %d\n", num1, num2, gcd);
        
        printf("Do you want to calculate GCD of another pair? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}