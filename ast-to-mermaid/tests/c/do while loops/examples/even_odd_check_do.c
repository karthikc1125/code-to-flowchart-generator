#include <stdio.h>

int main() {
    int number;
    int continueCalc;
    
    do {
        printf("Enter an integer: ");
        scanf("%d", &number);
        
        int temp = number;
        do {
            if (temp % 2 == 0) {
                printf("%d is even\n", temp);
            } else {
                printf("%d is odd\n", temp);
            }
            temp--;
        } while (temp > 0);
        
        printf("Do you want to check another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}