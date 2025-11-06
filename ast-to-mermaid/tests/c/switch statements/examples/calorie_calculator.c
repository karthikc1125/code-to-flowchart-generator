#include <stdio.h>

int main() {
    int choice;
    float weight, height, age, calories;
    
    printf("Calorie Calculator\n");
    printf("1. Male\n2. Female\n");
    printf("Enter your gender: ");
    scanf("%d", &choice);
    printf("Enter weight (kg): ");
    scanf("%f", &weight);
    printf("Enter height (cm): ");
    scanf("%f", &height);
    printf("Enter age (years): ");
    scanf("%f", &age);
    
    switch (choice) {
        case 1:
            calories = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
            printf("Daily calorie needs: %.0f calories\n", calories);
            break;
        case 2:
            calories = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
            printf("Daily calorie needs: %.0f calories\n", calories);
            break;
        default:
            printf("Invalid gender choice!\n");
    }
    
    return 0;
}