#include <stdio.h>

int main() {
    int n, first = 0, second = 1, next;
    int continueCalc;
    
    do {
        printf("Enter the number of terms: ");
        scanf("%d", &n);
        
        if (n <= 0) {
            printf("Please enter a positive integer.\n");
        } else {
            printf("Fibonacci Series: ");
            int i = 1;
            
            do {
                if (i == 1) {
                    printf("%d ", first);
                } else if (i == 2) {
                    printf("%d ", second);
                } else {
                    next = first + second;
                    printf("%d ", next);
                    first = second;
                    second = next;
                }
                i++;
            } while (i <= n);
            
            printf("\n");
        }
        
        printf("Do you want to generate another series? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}