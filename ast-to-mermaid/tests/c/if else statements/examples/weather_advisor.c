#include <stdio.h>

int main() {
    float temperature, humidity;
    
    printf("Weather Advisor\n");
    printf("Enter current temperature (°C): ");
    scanf("%f", &temperature);
    printf("Enter current humidity (%%): ");
    scanf("%f", &humidity);
    
    if (temperature < -10) {
        printf("Extreme cold! Stay indoors.\n");
    } else if (temperature < 0) {
        printf("Very cold! Wear heavy clothing.\n");
    } else if (temperature < 10) {
        printf("Cold! Wear warm clothes.\n");
    } else if (temperature < 20) {
        printf("Cool weather. Light jacket recommended.\n");
    } else if (temperature < 30) {
        printf("Pleasant weather. Enjoy outdoor activities.\n");
    } else if (temperature < 40) {
        printf("Hot! Stay hydrated and avoid direct sunlight.\n");
    } else {
        printf("Extreme heat! Stay indoors and keep cool.\n");
    }
    
    if (humidity > 80) {
        printf("High humidity. It may feel more uncomfortable.\n");
    } else if (humidity < 30) {
        printf("Low humidity. Stay hydrated.\n");
    }
    
    return 0;
}