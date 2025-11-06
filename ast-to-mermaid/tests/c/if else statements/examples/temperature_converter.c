#include <stdio.h>

int main() {
    float temperature, converted;
    int choice;
    
    printf("Temperature Converter\n");
    printf("1. Celsius to Fahrenheit\n2. Fahrenheit to Celsius\nEnter your choice: ");
    scanf("%d", &choice);
    printf("Enter temperature: ");
    scanf("%f", &temperature);
    
    if (choice == 1) {
        converted = (temperature * 9/5) + 32;
        printf("%.2f°C = %.2f°F\n", temperature, converted);
    } else if (choice == 2) {
        converted = (temperature - 32) * 5/9;
        printf("%.2f°F = %.2f°C\n", temperature, converted);
    } else {
        printf("Invalid choice!\n");
    }
    
    return 0;
}