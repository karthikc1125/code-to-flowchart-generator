#include <stdio.h>

int main() {
    int customerType;
    float amount, discount, finalAmount;
    
    printf("Shopping Discount Calculator:\n");
    printf("1. Regular Customer\n");
    printf("2. Silver Member\n");
    printf("3. Gold Member\n");
    printf("4. Platinum Member\n");
    printf("Enter customer type (1-4): ");
    scanf("%d", &customerType);
    
    printf("Enter purchase amount: ");
    scanf("%f", &amount);
    
    switch (customerType) {
        case 1:
            discount = amount * 0.05;  // 5% discount
            break;
        case 2:
            discount = amount * 0.10;  // 10% discount
            break;
        case 3:
            discount = amount * 0.15;  // 15% discount
            break;
        case 4:
            discount = amount * 0.20;  // 20% discount
            break;
        default:
            printf("Invalid customer type. No discount applied.\n");
            discount = 0;
    }
    
    finalAmount = amount - discount;
    printf("Original Amount: $%.2f\n", amount);
    printf("Discount: $%.2f\n", discount);
    printf("Final Amount: $%.2f\n", finalAmount);
    
    return 0;
}