#include <stdio.h>

int main() {
    float amount, discount, finalAmount;
    
    printf("Enter purchase amount: ");
    scanf("%f", &amount);
    
    if (amount >= 1000) {
        discount = amount * 0.20;  // 20% discount
    } else if (amount >= 500) {
        discount = amount * 0.15;  // 15% discount
    } else if (amount >= 100) {
        discount = amount * 0.10;  // 10% discount
    } else {
        discount = 0;  // No discount
    }
    
    finalAmount = amount - discount;
    printf("Original Amount: %.2f\n", amount);
    printf("Discount: %.2f\n", discount);
    printf("Final Amount: %.2f\n", finalAmount);
    
    return 0;
}