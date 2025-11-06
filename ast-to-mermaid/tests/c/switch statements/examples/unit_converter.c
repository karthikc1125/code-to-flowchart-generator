#include <stdio.h>

int main() {
    int choice;
    float value, converted;
    
    printf("Unit Converter\n");
    printf("1. Meters to Feet\n2. Liters to Gallons\n3. Celsius to Fahrenheit\n4. Kilograms to Pounds\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter value: ");
    scanf("%f", &value);
    
    switch (choice) {
        case 1:
            converted = value * 3.28084;
            printf("%.2f meters = %.2f feet\n", value, converted);
            break;
        case 2:
            converted = value * 0.264172;
            printf("%.2f liters = %.2f gallons\n", value, converted);
            break;
        case 3:
            converted = (value * 9/5) + 32;
            printf("%.2f°C = %.2f°F\n", value, converted);
            break;
        case 4:
            converted = value * 2.20462;
            printf("%.2f kg = %.2f lbs\n", value, converted);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}