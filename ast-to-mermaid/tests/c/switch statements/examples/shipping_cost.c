#include <stdio.h>

int main() {
    int choice;
    float weight, cost;
    
    printf("Shipping Cost Calculator\n");
    printf("1. Standard Shipping\n2. Express Shipping\n3. Overnight Shipping\n");
    printf("Select shipping method: ");
    scanf("%d", &choice);
    printf("Enter package weight (kg): ");
    scanf("%f", &weight);
    
    if (weight <= 0) {
        printf("Invalid weight!\n");
        return 0;
    }
    
    switch (choice) {
        case 1:
            cost = 5.00 + (weight * 1.50);
            printf("Standard shipping cost: $%.2f\n", cost);
            break;
        case 2:
            cost = 15.00 + (weight * 2.00);
            printf("Express shipping cost: $%.2f\n", cost);
            break;
        case 3:
            cost = 25.00 + (weight * 3.00);
            printf("Overnight shipping cost: $%.2f\n", cost);
            break;
        default:
            printf("Invalid shipping method!\n");
    }
    
    return 0;
}