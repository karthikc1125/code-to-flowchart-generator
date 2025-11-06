#include <stdio.h>

int main() {
    float temperature;
    int category;
    
    printf("Temperature Category Classifier\n");
    printf("Enter temperature in Celsius: ");
    scanf("%f", &temperature);
    
    if (temperature < -50 || temperature > 50) {
        printf("Extreme temperature!\n");
        return 0;
    }
    
    if (temperature < 0) {
        category = 1;
    } else if (temperature < 20) {
        category = 2;
    } else if (temperature < 30) {
        category = 3;
    } else {
        category = 4;
    }
    
    switch (category) {
        case 1:
            printf("%.1f°C - Freezing\n", temperature);
            break;
        case 2:
            printf("%.1f°C - Cold\n", temperature);
            break;
        case 3:
            printf("%.1f°C - Warm\n", temperature);
            break;
        case 4:
            printf("%.1f°C - Hot\n", temperature);
            break;
    }
    
    return 0;
}