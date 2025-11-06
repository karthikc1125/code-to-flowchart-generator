#include <stdio.h>

int main() {
    int zone, weight;
    float cost;
    
    printf("Delivery Cost Calculator\n");
    printf("1. Local (Zone 1)\n2. Regional (Zone 2)\n3. National (Zone 3)\n4. International (Zone 4)\n");
    printf("Select delivery zone: ");
    scanf("%d", &zone);
    printf("Enter package weight (kg): ");
    scanf("%d", &weight);
    
    if (weight <= 0) {
        printf("Invalid weight!\n");
        return 0;
    }
    
    switch (zone) {
        case 1:
            cost = weight * 2.00;
            printf("Local delivery cost: $%.2f\n", cost);
            break;
        case 2:
            cost = weight * 4.50;
            printf("Regional delivery cost: $%.2f\n", cost);
            break;
        case 3:
            cost = weight * 7.00;
            printf("National delivery cost: $%.2f\n", cost);
            break;
        case 4:
            cost = weight * 15.00;
            printf("International delivery cost: $%.2f\n", cost);
            break;
        default:
            printf("Invalid delivery zone!\n");
    }
    
    return 0;
}