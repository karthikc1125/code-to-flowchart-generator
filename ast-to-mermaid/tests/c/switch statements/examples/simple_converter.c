#include <stdio.h>

int main() {
    int choice;
    float value, converted;
    
    printf("Simple Converter\n");
    printf("1. Celsius to Fahrenheit\n2. Kilometers to Miles\n3. Kilograms to Pounds\n4. Hours to Minutes\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter value: ");
    scanf("%f", &value);
    
    switch (choice) {
        case 1:
            converted = (value * 9/5) + 32;
            printf("%.2f°C = %.2f°F\n", value, converted);
            break;
        case 2:
            converted = value * 0.621371;
            printf("%.2f km = %.2f miles\n", value, converted);
            break;
        case 3:
            converted = value * 2.20462;
            printf("%.2f kg = %.2f lbs\n", value, converted);
            break;
        case 4:
            converted = value * 60;
            printf("%.2f hours = %.2f minutes\n", value, converted);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}