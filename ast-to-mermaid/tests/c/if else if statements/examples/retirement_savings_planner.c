#include <stdio.h>
#include <math.h>

int main() {
    int age, retirementAge;
    float currentSavings, monthlyContribution, expectedReturn;
    float futureValue;
    
    printf("Retirement Savings Planner\n");
    printf("Enter current age: ");
    scanf("%d", &age);
    printf("Enter planned retirement age: ");
    scanf("%d", &retirementAge);
    printf("Enter current retirement savings: $");
    scanf("%f", &currentSavings);
    printf("Enter monthly contribution: $");
    scanf("%f", &monthlyContribution);
    printf("Enter expected annual return (%%): ");
    scanf("%f", &expectedReturn);
    
    if (age < 16 || retirementAge <= age || currentSavings < 0 || 
        monthlyContribution < 0 || expectedReturn < 0 || expectedReturn > 20) {
        printf("Invalid input!\n");
    } else {
        int years = retirementAge - age;
        float monthlyRate = expectedReturn / 1200; // Monthly rate as decimal
        int months = years * 12;
        
        // Future value of current savings
        futureValue = currentSavings * pow(1 + monthlyRate, months);
        
        // Future value of monthly contributions
        if (monthlyRate > 0) {
            futureValue += monthlyContribution * (pow(1 + monthlyRate, months) - 1) / monthlyRate;
        } else {
            futureValue += monthlyContribution * months;
        }
        
        printf("\n--- Retirement Projection ---\n");
        printf("Years until retirement: %d\n", years);
        printf("Projected savings at retirement: $%.2f\n", futureValue);
        
        if (futureValue < 500000) {
            printf("Status: Below target - Consider increasing contributions\n");
        } else if (futureValue < 1000000) {
            printf("Status: On track - Maintain current strategy\n");
        } else if (futureValue < 2000000) {
            printf("Status: Good - Strong retirement outlook\n");
        } else {
            printf("Status: Excellent - Well-prepared for retirement\n");
        }
    }
    
    return 0;
}