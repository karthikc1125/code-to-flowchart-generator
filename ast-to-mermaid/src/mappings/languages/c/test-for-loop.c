#include <stdio.h>

int main() {
    int sum = 0;
    
    // Simple for loop
    for (int i = 0; i < 5; i++) {
        sum += i;
        printf("Current sum: %d\n", sum);
    }
    
    printf("Final sum: %d\n", sum);
    return 0;
}