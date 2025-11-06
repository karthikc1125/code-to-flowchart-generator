#include <stdio.h>
#include <math.h>

int main() {
    float principal, rate, time, amount, interest;
    int compoundFrequency, investmentType;
    
    printf("Investment Calculator\n");
    printf("1. Simple Interest\n2. Compound Interest\nEnter your choice: ");
    scanf("%d", &investmentType);
    printf("Enter principal amount: $");
    scanf("%f", &principal);
    printf("Enter annual interest rate (%%): ");
    scanf("%f", &rate);
    printf("Enter time period (years): ");
    scanf("%f", &time);
    
    if (principal <= 0 || rate < 0 || time <= 0) {
        printf("Invalid input! All values must be positive.\n");
    } else if (investmentType == 1) {
        interest = (principal * rate * time) / 100;
        amount = principal + interest;
        printf("Simple Interest Investment:\n");
        printf("Principal: $%.2f\n", principal);
        printf("Interest: $%.2f\n", interest);
        printf("Total Amount: $%.2f\n", amount);
    } else if (investmentType == 2) {
        printf("Compound frequency:\n1. Annually\n2. Semi-annually\n3. Quarterly\n4. Monthly\nEnter choice: ");
        scanf("%d", &compoundFrequency);
        
        int n;
        if (compoundFrequency == 1) {
            n = 1;
        } else if (compoundFrequency == 2) {
            n = 2;
        } else if (compoundFrequency == 3) {
            n = 4;
        } else if (compoundFrequency == 4) {
            n = 12;
        } else {
            n = 1;
        }
        
        amount = principal * pow((1 + (rate/100)/n), n * time);
        interest = amount - principal;
        
        printf("Compound Interest Investment:\n");
        printf("Principal: $%.2f\n", principal);
        printf("Interest: $%.2f\n", interest);
        printf("Total Amount: $%.2f\n", amount);
    } else {
        printf("Invalid investment type!\n");
    }
    
    return 0;
}