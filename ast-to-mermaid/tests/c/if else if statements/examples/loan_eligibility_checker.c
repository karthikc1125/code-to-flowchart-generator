#include <stdio.h>

int main() {
    float income, creditScore, debt, loanAmount;
    int employmentYears;
    float debtToIncome, loanToIncome;
    
    printf("Loan Eligibility Checker\n");
    printf("Enter annual income: $");
    scanf("%f", &income);
    printf("Enter credit score (300-850): ");
    scanf("%f", &creditScore);
    printf("Enter total monthly debt payments: $");
    scanf("%f", &debt);
    printf("Enter loan amount requested: $");
    scanf("%f", &loanAmount);
    printf("Enter years of employment: ");
    scanf("%d", &employmentYears);
    
    if (income <= 0 || creditScore < 300 || creditScore > 850 || 
        debt < 0 || loanAmount <= 0 || employmentYears < 0) {
        printf("Invalid input!\n");
    } else {
        debtToIncome = (debt * 12) / income;
        loanToIncome = loanAmount / income;
        
        if (creditScore < 600) {
            printf("Not eligible: Credit score too low\n");
        } else if (debtToIncome > 0.4) {
            printf("Not eligible: Debt-to-income ratio too high\n");
        } else if (loanToIncome > 5) {
            printf("Not eligible: Loan amount too high relative to income\n");
        } else if (employmentYears < 2) {
            printf("Not eligible: Insufficient employment history\n");
        } else if (creditScore >= 750 && debtToIncome < 0.2) {
            printf("Eligible: Excellent terms available\n");
        } else if (creditScore >= 700 && debtToIncome < 0.3) {
            printf("Eligible: Good terms available\n");
        } else if (creditScore >= 650 && debtToIncome < 0.35) {
            printf("Eligible: Standard terms available\n");
        } else {
            printf("Eligible: Basic terms available\n");
        }
    }
    
    return 0;
}