#include <stdio.h>

int main() {
    float temperature;
    
    printf("Enter temperature in Celsius: ");
    scanf("%f", &temperature);
    
    if (temperature < 0) {
        printf("Freezing\n");
    } else if (temperature < 10) {
        printf("Very Cold\n");
    } else if (temperature < 20) {
        printf("Cold\n");
    } else if (temperature < 30) {
        printf("Warm\n");
    } else if (temperature < 40) {
        printf("Hot\n");
    } else {
        printf("Very Hot\n");
    }
    
    return 0;
}