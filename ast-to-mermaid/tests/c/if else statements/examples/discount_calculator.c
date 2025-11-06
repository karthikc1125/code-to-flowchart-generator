#include <stdio.h>

int main() {
    float amount, discount, finalAmount;
    
    printf("Enter the purchase amount: $");
    scanf("%f", &amount);
    
    if (amount < 0) {
        printf("Invalid amount!\n");
    } else if (amount >= 1000) {
        discount = amount * 0.20;
    } else if (amount >= 500) {
        discount = amount * 0.15;
    } else if (amount >= 100) {
        discount = amount * 0.10;
    } else {
        discount = amount * 0.05;
    }
    
    finalAmount = amount - discount;
    
    printf("Original amount: $%.2f\n", amount);
    printf("Discount: $%.2f\n", discount);
    printf("Final amount: $%.2f\n", finalAmount);
    
    return 0;
}