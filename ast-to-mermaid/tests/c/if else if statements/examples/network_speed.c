#include <stdio.h>

int main() {
    float speed;
    
    printf("Enter network speed (Mbps): ");
    scanf("%f", &speed);
    
    if (speed < 0) {
        printf("Invalid speed!\n");
    } else if (speed >= 1000) {
        printf("Network speed: %.2f Mbps - Excellent\n", speed);
        printf("Suitable for: 4K streaming, online gaming, video conferencing\n");
    } else if (speed >= 100) {
        printf("Network speed: %.2f Mbps - Good\n", speed);
        printf("Suitable for: HD streaming, online gaming\n");
    } else if (speed >= 50) {
        printf("Network speed: %.2f Mbps - Fair\n", speed);
        printf("Suitable for: SD streaming, web browsing\n");
    } else if (speed >= 10) {
        printf("Network speed: %.2f Mbps - Slow\n", speed);
        printf("Suitable for: Basic web browsing, email\n");
    } else {
        printf("Network speed: %.2f Mbps - Very Slow\n", speed);
        printf("Limited functionality\n");
    }
    
    return 0;
}