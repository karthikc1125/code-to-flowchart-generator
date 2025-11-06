#include <stdio.h>

int main() {
    int age, carValue, drivingExperience, accidents;
    float premium = 0;
    
    printf("Car Insurance Premium Calculator\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter car value ($): ");
    scanf("%d", &carValue);
    printf("Enter driving experience (years): ");
    scanf("%d", &drivingExperience);
    printf("Enter number of accidents in past 3 years: ");
    scanf("%d", &accidents);
    
    if (age < 16 || carValue < 1000 || drivingExperience < 0 || accidents < 0) {
        printf("Invalid input!\n");
    } else if (age < 25) {
        premium = carValue * 0.05; // High risk for young drivers
    } else if (age < 65) {
        premium = carValue * 0.03; // Standard rate
    } else {
        premium = carValue * 0.04; // Slightly higher for older drivers
    }
    
    // Adjust for driving experience
    if (drivingExperience < 2) {
        premium *= 1.3; // Inexperienced driver
    } else if (drivingExperience < 5) {
        premium *= 1.1; // Some experience
    } else if (drivingExperience > 20) {
        premium *= 0.9; // Experienced driver discount
    }
    
    // Adjust for accidents
    if (accidents == 1) {
        premium *= 1.2;
    } else if (accidents == 2) {
        premium *= 1.5;
    } else if (accidents > 2) {
        premium *= 2.0;
    }
    
    printf("Your annual insurance premium: $%.2f\n", premium);
    
    return 0;
}