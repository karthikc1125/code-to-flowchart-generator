#include <stdio.h>

int main() {
    float principal, rate, time, simpleInterest;
    int continueCalc;
    
    do {
        printf("Enter principal amount: ");
        scanf("%f", &principal);
        
        printf("Enter rate of interest: ");
        scanf("%f", &rate);
        
        printf("Enter time period (in years): ");
        scanf("%f", &time);
        
        simpleInterest = (principal * rate * time) / 100;
        printf("Simple Interest = %.2f\n", simpleInterest);
        printf("Total Amount = %.2f\n", principal + simpleInterest);
        
        printf("Do you want to calculate another interest? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}