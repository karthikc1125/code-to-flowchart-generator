#include <stdio.h>

int main() {
    float mealCost, taxRate, tipPercent;
    int serviceQuality;
    float tax, tip, total;
    
    printf("Restaurant Bill Calculator\n");
    printf("Enter meal cost: $");
    scanf("%f", &mealCost);
    printf("Enter tax rate (%%): ");
    scanf("%f", &taxRate);
    printf("Service quality:\n1. Poor\n2. Fair\n3. Good\n4. Excellent\nEnter choice: ");
    scanf("%d", &serviceQuality);
    
    if (mealCost < 0 || taxRate < 0 || serviceQuality < 1 || serviceQuality > 4) {
        printf("Invalid input!\n");
    } else {
        tax = mealCost * (taxRate / 100);
        
        if (serviceQuality == 1) {
            tipPercent = 10;
        } else if (serviceQuality == 2) {
            tipPercent = 15;
        } else if (serviceQuality == 3) {
            tipPercent = 20;
        } else {
            tipPercent = 25;
        }
        
        tip = mealCost * (tipPercent / 100);
        total = mealCost + tax + tip;
        
        printf("\n--- Restaurant Bill ---\n");
        printf("Meal cost: $%.2f\n", mealCost);
        printf("Tax (%.1f%%): $%.2f\n", taxRate, tax);
        printf("Tip (%.0f%%): $%.2f\n", tipPercent, tip);
        printf("Total: $%.2f\n", total);
    }
    
    return 0;
}