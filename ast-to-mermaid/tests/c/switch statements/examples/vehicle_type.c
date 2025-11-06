#include <stdio.h>

int main() {
    int wheels;
    
    printf("Vehicle Type Identifier\n");
    printf("Enter number of wheels: ");
    scanf("%d", &wheels);
    
    switch (wheels) {
        case 2:
            printf("Vehicle type: Motorcycle or Bicycle\n");
            break;
        case 3:
            printf("Vehicle type: Auto Rickshaw or Tricycle\n");
            break;
        case 4:
            printf("Vehicle type: Car or SUV\n");
            break;
        case 6:
            printf("Vehicle type: Truck or Bus\n");
            break;
        case 8:
            printf("Vehicle type: Heavy Truck or Bus\n");
            break;
        case 18:
            printf("Vehicle type: Trailer Truck\n");
            break;
        default:
            printf("Unknown vehicle type with %d wheels\n", wheels);
    }
    
    return 0;
}