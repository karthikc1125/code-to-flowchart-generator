#include <stdio.h>

int main() {
    int n, steps, temp;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &n);
        
        temp = n;
        steps = 0;
        printf("Collatz sequence: %d ", temp);
        do {
            if (temp % 2 == 0) {
                temp = temp / 2;
            } else {
                temp = 3 * temp + 1;
            }
            printf("%d ", temp);
            steps++;
        } while (temp != 1);
        
        printf("\nNumber of steps to reach 1: %d\n", steps);
        
        printf("Do you want to try another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}