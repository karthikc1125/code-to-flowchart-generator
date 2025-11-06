#include <stdio.h>

int main() {
    int wheels, engine, passengers;
    
    printf("Vehicle Type Classifier\n");
    printf("Enter number of wheels: ");
    scanf("%d", &wheels);
    printf("Enter engine capacity (cc): ");
    scanf("%d", &engine);
    printf("Enter passenger capacity: ");
    scanf("%d", &passengers);
    
    if (wheels < 0 || engine < 0 || passengers < 0) {
        printf("Invalid input!\n");
    } else if (wheels == 2 && engine <= 125) {
        printf("Vehicle type: Motorcycle\n");
    } else if (wheels == 2 && engine > 125) {
        printf("Vehicle type: Sports Bike\n");
    } else if (wheels == 3) {
        printf("Vehicle type: Auto Rickshaw\n");
    } else if (wheels == 4 && passengers <= 5) {
        printf("Vehicle type: Car\n");
    } else if (wheels == 4 && passengers > 5 && passengers <= 15) {
        printf("Vehicle type: Mini Bus\n");
    } else if (wheels == 4 && passengers > 15) {
        printf("Vehicle type: Bus\n");
    } else if (wheels > 4 && passengers > 15) {
        printf("Vehicle type: Truck\n");
    } else if (wheels == 6 || wheels == 8) {
        printf("Vehicle type: Heavy Vehicle\n");
    } else {
        printf("Vehicle type: Other\n");
    }
    
    return 0;
}