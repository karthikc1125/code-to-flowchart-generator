#include <stdio.h>

int main() {
    int customerType;
    float amount, discount, finalAmount;
    
    printf("Discount Calculator\n");
    printf("1. Regular Customer\n2. Silver Member\n3. Gold Member\n4. Platinum Member\n");
    printf("Enter customer type: ");
    scanf("%d", &customerType);
    printf("Enter purchase amount: $");
    scanf("%f", &amount);
    
    if (amount < 0) {
        printf("Invalid amount!\n");
        return 0;
    }
    
    switch (customerType) {
        case 1:
            discount = amount * 0.05;
            printf("Regular customer discount: 5%%\n");
            break;
        case 2:
            discount = amount * 0.10;
            printf("Silver member discount: 10%%\n");
            break;
        case 3:
            discount = amount * 0.15;
            printf("Gold member discount: 15%%\n");
            break;
        case 4:
            discount = amount * 0.20;
            printf("Platinum member discount: 20%%\n");
            break;
        default:
            printf("Invalid customer type! No discount applied.\n");
            discount = 0;
    }
    
    finalAmount = amount - discount;
    printf("Original amount: $%.2f\n", amount);
    printf("Discount: $%.2f\n", discount);
    printf("Final amount: $%.2f\n", finalAmount);
    
    return 0;
}