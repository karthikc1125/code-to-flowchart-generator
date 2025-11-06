#include <stdio.h>

int main() {
    float income, creditScore, loanAmount;
    int age, employmentYears;
    
    printf("Loan Approval System\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter your annual income: $");
    scanf("%f", &income);
    printf("Enter your credit score (300-850): ");
    scanf("%f", &creditScore);
    printf("Enter years of employment: ");
    scanf("%d", &employmentYears);
    printf("Enter loan amount requested: $");
    scanf("%f", &loanAmount);
    
    if (age < 18 || age > 70) {
        printf("Loan not approved: Age criteria not met.\n");
    } else if (income < 20000) {
        printf("Loan not approved: Insufficient income.\n");
    } else if (creditScore < 600) {
        printf("Loan not approved: Poor credit score.\n");
    } else if (employmentYears < 2) {
        printf("Loan not approved: Insufficient employment history.\n");
    } else if (loanAmount > income * 5) {
        printf("Loan not approved: Requested amount too high.\n");
    } else {
        float interestRate;
        
        if (creditScore >= 750) {
            interestRate = 3.5;
        } else if (creditScore >= 700) {
            interestRate = 4.0;
        } else if (creditScore >= 650) {
            interestRate = 5.0;
        } else {
            interestRate = 6.0;
        }
        
        printf("Loan approved!\n");
        printf("Interest rate: %.2f%%\n", interestRate);
        printf("Monthly payment: $%.2f\n", (loanAmount * (1 + interestRate/100)) / 12);
    }
    
    return 0;
}