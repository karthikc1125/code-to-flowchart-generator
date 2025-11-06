#include <stdio.h>

int main() {
    float income, debt, downPayment, housePrice;
    float debtToIncome, loanAmount, monthlyPayment;
    
    printf("Real Estate Affordability Calculator\n");
    printf("Enter annual income: $");
    scanf("%f", &income);
    printf("Enter monthly debt payments: $");
    scanf("%f", &debt);
    printf("Enter down payment available: $");
    scanf("%f", &downPayment);
    printf("Enter house price: $");
    scanf("%f", &housePrice);
    
    if (income <= 0 || debt < 0 || downPayment < 0 || housePrice <= 0) {
        printf("Invalid input!\n");
    } else {
        loanAmount = housePrice - downPayment;
        debtToIncome = (debt + (loanAmount * 0.005)) / (income / 12); // Approx monthly payment
        
        printf("\n--- Affordability Analysis ---\n");
        printf("Loan amount needed: $%.2f\n", loanAmount);
        printf("Debt-to-income ratio: %.2f\n", debtToIncome);
        
        if (debtToIncome > 0.43) {
            printf("Status: Not affordable - DTI ratio too high\n");
        } else if (debtToIncome > 0.36) {
            printf("Status: Marginally affordable - Careful consideration needed\n");
        } else if (debtToIncome > 0.28) {
            printf("Status: Affordable - Within recommended guidelines\n");
        } else {
            printf("Status: Very affordable - Strong financial position\n");
        }
        
        if (downPayment < housePrice * 0.2) {
            printf("Note: Consider increasing down payment to avoid PMI\n");
        }
    }
    
    return 0;
}