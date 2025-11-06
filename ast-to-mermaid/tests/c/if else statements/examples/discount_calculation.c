#include <stdio.h>

int main() {
    float purchase_amount = 150.0;
    float discount;
    
    if (purchase_amount >= 100) {
        discount = purchase_amount * 0.1; // 10% discount
        printf("You get a discount of $%.2f\n", discount);
    } else {
        discount = 0;
        printf("No discount available for purchases under $100.\n");
    }
    
    printf("Total amount to pay: $%.2f\n", purchase_amount - discount);
    
    return 0;
}