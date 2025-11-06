#include <stdio.h>

int main() {
    float distance, speed, traffic;
    float time;
    
    printf("Travel Time Calculator\n");
    printf("Enter distance (miles): ");
    scanf("%f", &distance);
    printf("Enter average speed (mph): ");
    scanf("%f", &speed);
    printf("Traffic conditions:\n1. Light\n2. Moderate\n3. Heavy\nEnter choice: ");
    scanf("%f", &traffic);
    
    if (distance < 0 || speed <= 0 || traffic < 1 || traffic > 3) {
        printf("Invalid input!\n");
    } else {
        time = distance / speed;
        
        if (traffic == 1) {
            time *= 1.0; // No adjustment for light traffic
        } else if (traffic == 2) {
            time *= 1.3; // 30% more time for moderate traffic
        } else {
            time *= 1.8; // 80% more time for heavy traffic
        }
        
        int hours = (int)time;
        int minutes = (int)((time - hours) * 60);
        
        printf("Estimated travel time: %d hours and %d minutes\n", hours, minutes);
    }
    
    return 0;
}