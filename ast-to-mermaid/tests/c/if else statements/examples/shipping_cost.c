#include <stdio.h>

int main() {
    float weight, cost;
    
    printf("Enter the weight of the package (kg): ");
    scanf("%f", &weight);
    
    if (weight < 0) {
        printf("Invalid weight!\n");
    } else if (weight <= 1) {
        cost = 5.00;
    } else if (weight <= 5) {
        cost = 5.00 + (weight - 1) * 2.00;
    } else if (weight <= 10) {
        cost = 5.00 + 4 * 2.00 + (weight - 5) * 1.50;
    } else {
        cost = 5.00 + 4 * 2.00 + 5 * 1.50 + (weight - 10) * 1.00;
    }
    
    printf("Shipping cost: $%.2f\n", cost);
    
    return 0;
}