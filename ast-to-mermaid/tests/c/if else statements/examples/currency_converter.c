#include <stdio.h>

int main() {
    float amount, converted;
    int choice;
    
    printf("Currency Converter\n");
    printf("1. USD to EUR\n2. EUR to USD\n3. USD to GBP\n4. GBP to USD\nEnter your choice: ");
    scanf("%d", &choice);
    printf("Enter amount: $");
    scanf("%f", &amount);
    
    if (choice == 1) {
        converted = amount * 0.85; // Approximate exchange rate
        printf("$%.2f USD = €%.2f EUR\n", amount, converted);
    } else if (choice == 2) {
        converted = amount * 1.18; // Approximate exchange rate
        printf("€%.2f EUR = $%.2f USD\n", amount, converted);
    } else if (choice == 3) {
        converted = amount * 0.73; // Approximate exchange rate
        printf("$%.2f USD = £%.2f GBP\n", amount, converted);
    } else if (choice == 4) {
        converted = amount * 1.37; // Approximate exchange rate
        printf("£%.2f GBP = $%.2f USD\n", amount, converted);
    } else {
        printf("Invalid choice!\n");
    }
    
    return 0;
}