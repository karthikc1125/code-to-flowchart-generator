#include <stdio.h>

int main() {
    int number;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    printf("Countdown: ");
    while (number > 0) {
        printf("%d ", number);
        number--;
    }
    printf("Done!\n");
    
    return 0;
}