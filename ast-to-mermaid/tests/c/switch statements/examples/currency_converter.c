#include <stdio.h>

int main() {
    int choice;
    float amount, converted;
    
    printf("Currency Converter\n");
    printf("1. USD to EUR\n2. EUR to USD\n3. USD to GBP\n4. GBP to USD\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter amount: $");
    scanf("%f", &amount);
    
    switch (choice) {
        case 1:
            converted = amount * 0.85;
            printf("$%.2f USD = €%.2f EUR\n", amount, converted);
            break;
        case 2:
            converted = amount * 1.18;
            printf("€%.2f EUR = $%.2f USD\n", amount, converted);
            break;
        case 3:
            converted = amount * 0.73;
            printf("$%.2f USD = £%.2f GBP\n", amount, converted);
            break;
        case 4:
            converted = amount * 1.37;
            printf("£%.2f GBP = $%.2f USD\n", amount, converted);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}