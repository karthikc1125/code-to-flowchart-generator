#include <stdio.h>

int main() {
    float temperature;
    int condition;
    
    printf("Weather Advisor\n");
    printf("Enter temperature in Celsius: ");
    scanf("%f", &temperature);
    
    if (temperature < -30 || temperature > 50) {
        printf("Extreme weather conditions!\n");
        return 0;
    }
    
    if (temperature < 0) {
        condition = 1;
    } else if (temperature < 15) {
        condition = 2;
    } else if (temperature < 25) {
        condition = 3;
    } else if (temperature < 35) {
        condition = 4;
    } else {
        condition = 5;
    }
    
    switch (condition) {
        case 1:
            printf("%.1f°C - Dress warmly, wear layers\n", temperature);
            break;
        case 2:
            printf("%.1f°C - Light jacket recommended\n", temperature);
            break;
        case 3:
            printf("%.1f°C - Comfortable weather, t-shirt and jeans\n", temperature);
            break;
        case 4:
            printf("%.1f°C - Warm weather, light clothing\n", temperature);
            break;
        case 5:
            printf("%.1f°C - Hot weather, stay hydrated\n", temperature);
            break;
    }
    
    return 0;
}