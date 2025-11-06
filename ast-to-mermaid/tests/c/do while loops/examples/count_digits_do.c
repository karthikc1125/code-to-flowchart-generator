#include <stdio.h>

int main() {
    int number, count, temp;
    int continueCalc;
    
    do {
        printf("Enter an integer: ");
        scanf("%d", &number);
        
        count = 0;
        temp = number;
        if (temp == 0) {
            count = 1;
        }
        
        do {
            temp /= 10;
            count++;
        } while (temp != 0);
        
        printf("Number of digits in %d = %d\n", number, count);
        
        printf("Do you want to count digits of another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}