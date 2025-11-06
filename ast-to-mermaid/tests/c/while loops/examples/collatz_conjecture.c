#include <stdio.h>

int main() {
    int n, steps = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    
    printf("Collatz sequence: %d ", n);
    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        printf("%d ", n);
        steps++;
    }
    
    printf("\nNumber of steps to reach 1: %d\n", steps);
    
    return 0;
}