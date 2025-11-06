#include <stdio.h>

int main() {
    int roomType, nights, guests;
    float price = 0;
    
    printf("Hotel Booking System\n");
    printf("Room types:\n1. Standard ($100/night)\n2. Deluxe ($150/night)\n3. Suite ($250/night)\nSelect room type: ");
    scanf("%d", &roomType);
    printf("Enter number of nights: ");
    scanf("%d", &nights);
    printf("Enter number of guests: ");
    scanf("%d", &guests);
    
    if (roomType < 1 || roomType > 3 || nights <= 0 || guests <= 0) {
        printf("Invalid input!\n");
    } else if (roomType == 1) {
        price = 100 * nights;
        if (guests > 2) {
            price += 20 * nights * (guests - 2); // Extra charge for additional guests
        }
        printf("Room type: Standard\n");
    } else if (roomType == 2) {
        price = 150 * nights;
        if (guests > 3) {
            price += 15 * nights * (guests - 3); // Extra charge for additional guests
        }
        printf("Room type: Deluxe\n");
    } else {
        price = 250 * nights;
        if (guests > 4) {
            price += 10 * nights * (guests - 4); // Extra charge for additional guests
        }
        printf("Room type: Suite\n");
    }
    
    // Apply discounts
    if (nights >= 7) {
        price *= 0.85; // 15% discount for week-long stay
        printf("15%% discount applied for long stay\n");
    } else if (nights >= 3) {
        price *= 0.90; // 10% discount for 3+ night stay
        printf("10%% discount applied\n");
    }
    
    printf("Total cost: $%.2f\n", price);
    
    return 0;
}