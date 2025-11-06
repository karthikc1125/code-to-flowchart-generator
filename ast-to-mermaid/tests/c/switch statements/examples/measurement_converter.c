#include <stdio.h>

int main() {
    int choice;
    float value, converted;
    
    printf("Measurement Converter\n");
    printf("1. Inches to Centimeters\n2. Pounds to Kilograms\n3. Fahrenheit to Celsius\n4. Miles to Kilometers\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter value: ");
    scanf("%f", &value);
    
    switch (choice) {
        case 1:
            converted = value * 2.54;
            printf("%.2f inches = %.2f centimeters\n", value, converted);
            break;
        case 2:
            converted = value * 0.453592;
            printf("%.2f pounds = %.2f kilograms\n", value, converted);
            break;
        case 3:
            converted = (value - 32) * 5/9;
            printf("%.2f°F = %.2f°C\n", value, converted);
            break;
        case 4:
            converted = value * 1.60934;
            printf("%.2f miles = %.2f kilometers\n", value, converted);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}