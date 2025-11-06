#include <stdio.h>

int main() {
    float weight, cost;
    int zone;
    
    printf("Enter package weight (kg): ");
    scanf("%f", &weight);
    
    printf("Enter shipping zone (1-4): ");
    scanf("%d", &zone);
    
    if (weight <= 0) {
        printf("Invalid weight\n");
    } else if (zone == 1) {
        cost = weight * 5.0;
        printf("Shipping cost: %.2f\n", cost);
    } else if (zone == 2) {
        cost = weight * 10.0;
        printf("Shipping cost: %.2f\n", cost);
    } else if (zone == 3) {
        cost = weight * 15.0;
        printf("Shipping cost: %.2f\n", cost);
    } else if (zone == 4) {
        cost = weight * 20.0;
        printf("Shipping cost: %.2f\n", cost);
    } else {
        printf("Invalid zone\n");
    }
    
    return 0;
}