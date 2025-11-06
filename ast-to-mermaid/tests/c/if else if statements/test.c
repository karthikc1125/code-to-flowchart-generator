#include <stdio.h>

int main() {
    int temperature = 25;
    int isRaining = 0;  // 0 for false, 1 for true
    
    if (temperature > 20 && !isRaining) {
        printf("It's a great day for outdoor activities!\n");
    } else if (temperature > 20 && isRaining) {
        printf("It's warm but raining, bring an umbrella.\n");
    } else if (temperature <= 20 && !isRaining) {
        printf("It's cool but not raining, a light jacket is recommended.\n");
    } else {
        printf("It's cold and raining, stay indoors.\n");
    }
    
    return 0;
}