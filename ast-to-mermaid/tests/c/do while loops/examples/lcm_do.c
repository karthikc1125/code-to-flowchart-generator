#include <stdio.h>

int main() {
    int num1, num2, max, lcm;
    int continueCalc;
    
    do {
        printf("Enter two positive integers: ");
        scanf("%d %d", &num1, &num2);
        
        max = (num1 > num2) ? num1 : num2;
        int found = 0;
        
        do {
            if (max % num1 == 0 && max % num2 == 0) {
                lcm = max;
                found = 1;
            } else {
                max++;
            }
        } while (!found);
        
        printf("LCM of %d and %d is %d\n", num1, num2, lcm);
        
        printf("Do you want to calculate LCM of another pair? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}