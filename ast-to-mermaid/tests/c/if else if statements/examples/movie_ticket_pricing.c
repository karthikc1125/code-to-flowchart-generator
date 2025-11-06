#include <stdio.h>

int main() {
    int age, time, day;
    float price = 0;
    
    printf("Movie Ticket Pricing System\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter show time (24-hour format, e.g., 14 for 2 PM): ");
    scanf("%d", &time);
    printf("Enter day of week (1=Monday, 7=Sunday): ");
    scanf("%d", &day);
    
    if (age < 0 || time < 0 || time > 24 || day < 1 || day > 7) {
        printf("Invalid input!\n");
    } else if (age < 5) {
        price = 0; // Free for children under 5
        printf("Child under 5 - Free admission\n");
    } else if (age >= 65) {
        price = 6.00; // Senior discount
    } else if (age <= 12) {
        price = 5.00; // Child price
    } else if (day == 2) { // Tuesday discount
        price = 7.00;
    } else if (time < 12) { // Matinee pricing
        price = 8.00;
    } else if (day == 6 || day == 7) { // Weekend pricing
        price = 12.00;
    } else {
        price = 10.00; // Regular pricing
    }
    
    if (age >= 5) {
        printf("Ticket price: $%.2f\n", price);
    }
    
    return 0;
}