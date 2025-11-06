#include <stdio.h>

int main() {
    float principal, rate, time, simpleInterest, amount;
    
    printf("Simple Interest Calculator\n");
    printf("Enter principal amount: $");
    scanf("%f", &principal);
    printf("Enter rate of interest (%%): ");
    scanf("%f", &rate);
    printf("Enter time period (years): ");
    scanf("%f", &time);
    
    if (principal < 0 || rate < 0 || time < 0) {
        printf("Invalid input! All values must be positive.\n");
    } else {
        simpleInterest = (principal * rate * time) / 100;
        amount = principal + simpleInterest;
        
        printf("Principal: $%.2f\n", principal);
        printf("Rate: %.2f%%\n", rate);
        printf("Time: %.2f years\n", time);
        printf("Simple Interest: $%.2f\n", simpleInterest);
        printf("Total Amount: $%.2f\n", amount);
    }
    
    return 0;
}