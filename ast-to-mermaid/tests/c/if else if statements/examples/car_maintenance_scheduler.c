#include <stdio.h>

int main() {
    int mileage, oilChange, tireRotation, brakeCheck;
    int nextOil, nextTire, nextBrake;
    
    printf("Car Maintenance Scheduler\n");
    printf("Enter current mileage: ");
    scanf("%d", &mileage);
    
    if (mileage < 0) {
        printf("Invalid mileage!\n");
    } else {
        // Calculate next service intervals
        nextOil = ((mileage / 5000) + 1) * 5000;
        nextTire = ((mileage / 10000) + 1) * 10000;
        nextBrake = ((mileage / 20000) + 1) * 20000;
        
        printf("\n--- Maintenance Schedule ---\n");
        printf("Next oil change: %d miles (%d miles remaining)\n", nextOil, nextOil - mileage);
        printf("Next tire rotation: %d miles (%d miles remaining)\n", nextTire, nextTire - mileage);
        printf("Next brake check: %d miles (%d miles remaining)\n", nextBrake, nextBrake - mileage);
        
        if (mileage >= 100000) {
            printf("\n*** Important: Your car has high mileage. Consider major service ***\n");
        } else if (mileage >= 50000) {
            printf("\n*** Note: Consider transmission service ***\n");
        }
    }
    
    return 0;
}