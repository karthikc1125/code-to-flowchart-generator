#include <stdio.h>

int main() {
    float temperature, humidity, pressure;
    
    printf("Weather Forecast System\n");
    printf("Enter current temperature (°F): ");
    scanf("%f", &temperature);
    printf("Enter current humidity (%%): ");
    scanf("%f", &humidity);
    printf("Enter current barometric pressure (inHg): ");
    scanf("%f", &pressure);
    
    if (temperature < -50 || temperature > 150 || humidity < 0 || humidity > 100 || pressure < 25 || pressure > 32) {
        printf("Invalid input!\n");
    } else {
        printf("\n--- Weather Forecast ---\n");
        
        if (pressure < 29.5) {
            printf("Low pressure system - Stormy weather likely\n");
        } else if (pressure > 30.5) {
            printf("High pressure system - Clear weather expected\n");
        } else {
            printf("Normal pressure - Average weather conditions\n");
        }
        
        if (temperature < 32) {
            printf("Freezing temperatures - Snow or ice possible\n");
        } else if (temperature < 50) {
            printf("Cold temperatures - Possible precipitation\n");
        } else if (temperature < 70) {
            printf("Mild temperatures - Comfortable conditions\n");
        } else {
            printf("Warm temperatures - Sunny conditions likely\n");
        }
        
        if (humidity > 80) {
            printf("High humidity - Muggy or rainy conditions\n");
        } else if (humidity > 50) {
            printf("Moderate humidity - Comfortable conditions\n");
        } else {
            printf("Low humidity - Dry conditions\n");
        }
    }
    
    return 0;
}