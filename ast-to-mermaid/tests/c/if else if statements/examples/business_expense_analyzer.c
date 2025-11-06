#include <stdio.h>

int main() {
    float rent, utilities, salaries, marketing, supplies, other;
    float totalExpenses, profit, revenue;
    float expensePercentages[6];
    
    printf("Business Expense Analyzer\n");
    printf("Enter monthly revenue: $");
    scanf("%f", &revenue);
    printf("Enter rent expense: $");
    scanf("%f", &rent);
    printf("Enter utilities expense: $");
    scanf("%f", &utilities);
    printf("Enter salaries expense: $");
    scanf("%f", &salaries);
    printf("Enter marketing expense: $");
    scanf("%f", &marketing);
    printf("Enter supplies expense: $");
    scanf("%f", &supplies);
    printf("Enter other expenses: $");
    scanf("%f", &other);
    
    if (revenue < 0 || rent < 0 || utilities < 0 || salaries < 0 || 
        marketing < 0 || supplies < 0 || other < 0) {
        printf("Invalid input!\n");
    } else {
        totalExpenses = rent + utilities + salaries + marketing + supplies + other;
        profit = revenue - totalExpenses;
        
        printf("\n--- Expense Analysis ---\n");
        printf("Total revenue: $%.2f\n", revenue);
        printf("Total expenses: $%.2f\n", totalExpenses);
        printf("Net profit: $%.2f\n", profit);
        
        if (profit > 0) {
            printf("Status: Profitable\n");
        } else if (profit == 0) {
            printf("Status: Break-even\n");
        } else {
            printf("Status: Operating at a loss\n");
        }
        
        // Calculate expense percentages
        if (totalExpenses > 0) {
            expensePercentages[0] = (rent / totalExpenses) * 100;
            expensePercentages[1] = (utilities / totalExpenses) * 100;
            expensePercentages[2] = (salaries / totalExpenses) * 100;
            expensePercentages[3] = (marketing / totalExpenses) * 100;
            expensePercentages[4] = (supplies / totalExpenses) * 100;
            expensePercentages[5] = (other / totalExpenses) * 100;
            
            printf("\n--- Expense Breakdown ---\n");
            printf("Rent: %.1f%%\n", expensePercentages[0]);
            printf("Utilities: %.1f%%\n", expensePercentages[1]);
            printf("Salaries: %.1f%%\n", expensePercentages[2]);
            printf("Marketing: %.1f%%\n", expensePercentages[3]);
            printf("Supplies: %.1f%%\n", expensePercentages[4]);
            printf("Other: %.1f%%\n", expensePercentages[5]);
            
            // Identify high expense categories
            if (expensePercentages[2] > 40) {
                printf("Note: Salaries are a high percentage of expenses\n");
            }
            
            if (expensePercentages[3] > 15) {
                printf("Note: Marketing costs are relatively high\n");
            }
        }
    }
    
    return 0;
}