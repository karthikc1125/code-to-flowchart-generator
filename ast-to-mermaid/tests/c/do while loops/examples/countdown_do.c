#include <stdio.h>

int main() {
    int number;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &number);
        
        if (number <= 0) {
            printf("Please enter a positive integer.\n");
        } else {
            printf("Countdown: ");
            int temp = number;
            
            do {
                printf("%d ", temp);
                temp--;
            } while (temp >= 0);
            
            printf("Done!\n");
        }
        
        printf("Do you want to count down from another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}