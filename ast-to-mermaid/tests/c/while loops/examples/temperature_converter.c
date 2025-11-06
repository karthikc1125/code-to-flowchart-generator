#include <stdio.h>

int main() {
    int choice;
    float temperature, converted;
    int continueConversion = 1;
    
    while (continueConversion) {
        printf("\nTemperature Converter:\n");
        printf("1. Celsius to Fahrenheit\n");
        printf("2. Fahrenheit to Celsius\n");
        printf("3. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        
        switch (choice) {
            case 1:
                printf("Enter temperature in Celsius: ");
                scanf("%f", &temperature);
                converted = (temperature * 9/5) + 32;
                printf("%.2f Celsius = %.2f Fahrenheit\n", temperature, converted);
                break;
            case 2:
                printf("Enter temperature in Fahrenheit: ");
                scanf("%f", &temperature);
                converted = (temperature - 32) * 5/9;
                printf("%.2f Fahrenheit = %.2f Celsius\n", temperature, converted);
                break;
            case 3:
                continueConversion = 0;
                printf("Goodbye!\n");
                break;
            default:
                printf("Invalid choice. Please try again.\n");
        }
    }
    
    return 0;
}