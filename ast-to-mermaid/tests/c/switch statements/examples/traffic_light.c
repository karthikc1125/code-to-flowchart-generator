#include <stdio.h>

int main() {
    char light;
    
    printf("Traffic Light Action\n");
    printf("Enter light color (R/G/Y): ");
    scanf(" %c", &light);
    
    switch (light) {
        case 'R':
        case 'r':
            printf("Stop! Red light\n");
            break;
        case 'G':
        case 'g':
            printf("Go! Green light\n");
            break;
        case 'Y':
        case 'y':
            printf("Slow down! Yellow light\n");
            break;
        default:
            printf("Invalid light color!\n");
    }
    
    return 0;
}