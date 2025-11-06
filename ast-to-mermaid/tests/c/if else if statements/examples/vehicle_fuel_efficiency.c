#include <stdio.h>

int main() {
    float distance, fuelUsed, fuelEfficiency;
    int vehicleType;
    
    printf("Vehicle Fuel Efficiency Calculator\n");
    printf("Enter distance traveled (miles): ");
    scanf("%f", &distance);
    printf("Enter fuel used (gallons): ");
    scanf("%f", &fuelUsed);
    printf("Vehicle type:\n1. Car\n2. Truck\n3. SUV\n4. Motorcycle\nEnter choice: ");
    scanf("%d", &vehicleType);
    
    if (distance <= 0 || fuelUsed <= 0 || vehicleType < 1 || vehicleType > 4) {
        printf("Invalid input!\n");
    } else {
        fuelEfficiency = distance / fuelUsed;
        
        printf("\n--- Fuel Efficiency Report ---\n");
        printf("Fuel efficiency: %.2f miles per gallon\n", fuelEfficiency);
        
        if (vehicleType == 1) { // Car
            if (fuelEfficiency >= 35) {
                printf("Rating: Excellent for a car\n");
            } else if (fuelEfficiency >= 25) {
                printf("Rating: Good for a car\n");
            } else if (fuelEfficiency >= 20) {
                printf("Rating: Average for a car\n");
            } else {
                printf("Rating: Poor for a car\n");
            }
        } else if (vehicleType == 2) { // Truck
            if (fuelEfficiency >= 25) {
                printf("Rating: Excellent for a truck\n");
            } else if (fuelEfficiency >= 20) {
                printf("Rating: Good for a truck\n");
            } else if (fuelEfficiency >= 15) {
                printf("Rating: Average for a truck\n");
            } else {
                printf("Rating: Poor for a truck\n");
            }
        } else if (vehicleType == 3) { // SUV
            if (fuelEfficiency >= 30) {
                printf("Rating: Excellent for an SUV\n");
            } else if (fuelEfficiency >= 22) {
                printf("Rating: Good for an SUV\n");
            } else if (fuelEfficiency >= 18) {
                printf("Rating: Average for an SUV\n");
            } else {
                printf("Rating: Poor for an SUV\n");
            }
        } else { // Motorcycle
            if (fuelEfficiency >= 50) {
                printf("Rating: Excellent for a motorcycle\n");
            } else if (fuelEfficiency >= 40) {
                printf("Rating: Good for a motorcycle\n");
            } else if (fuelEfficiency >= 30) {
                printf("Rating: Average for a motorcycle\n");
            } else {
                printf("Rating: Poor for a motorcycle\n");
            }
        }
    }
    
    return 0;
}