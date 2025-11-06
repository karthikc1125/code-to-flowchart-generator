#include <stdio.h>

int main() {
    int accountType;
    float principal, rate, time, interest;
    
    printf("Simple Interest Calculator\n");
    printf("1. Savings Account\n2. Fixed Deposit\n3. Loan Account\n");
    printf("Select account type: ");
    scanf("%d", &accountType);
    printf("Enter principal amount: $");
    scanf("%f", &principal);
    printf("Enter rate of interest (%%): ");
    scanf("%f", &rate);
    printf("Enter time period (years): ");
    scanf("%f", &time);
    
    if (principal <= 0 || rate < 0 || time <= 0) {
        printf("Invalid input!\n");
        return 0;
    }
    
    switch (accountType) {
        case 1:
            interest = (principal * rate * time) / 100;
            printf("Savings Account Interest: $%.2f\n", interest);
            break;
        case 2:
            interest = (principal * (rate + 2.0) * time) / 100;
            printf("Fixed Deposit Interest: $%.2f (Rate: %.2f%%)\n", interest, rate + 2.0);
            break;
        case 3:
            interest = (principal * (rate + 5.0) * time) / 100;
            printf("Loan Account Interest: $%.2f (Rate: %.2f%%)\n", interest, rate + 5.0);
            break;
        default:
            printf("Invalid account type!\n");
    }
    
    return 0;
}