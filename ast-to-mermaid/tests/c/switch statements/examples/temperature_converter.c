#include <stdio.h>

int main() {
    int choice;
    float temperature, converted;
    
    printf("Temperature Converter\n");
    printf("1. Celsius to Fahrenheit\n2. Fahrenheit to Celsius\n3. Celsius to Kelvin\n4. Kelvin to Celsius\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter temperature: ");
    scanf("%f", &temperature);
    
    switch (choice) {
        case 1:
            converted = (temperature * 9/5) + 32;
            printf("%.2f°C = %.2f°F\n", temperature, converted);
            break;
        case 2:
            converted = (temperature - 32) * 5/9;
            printf("%.2f°F = %.2f°C\n", temperature, converted);
            break;
        case 3:
            converted = temperature + 273.15;
            printf("%.2f°C = %.2f K\n", temperature, converted);
            break;
        case 4:
            converted = temperature - 273.15;
            printf("%.2f K = %.2f°C\n", temperature, converted);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}