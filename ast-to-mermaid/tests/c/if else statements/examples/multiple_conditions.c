#include <stdio.h>

int main() {
    int temperature = 25;
    int is_raining = 0; // 0 for false, 1 for true
    
    if (temperature > 20 && !is_raining) {
        printf("It's a great day for outdoor activities!\n");
    } else {
        printf("You might want to stay indoors.\n");
    }
    
    return 0;
}