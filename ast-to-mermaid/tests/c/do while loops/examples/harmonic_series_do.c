#include <stdio.h>

int main() {
    int n, i;
    double sum;
    int continueCalc;
    
    do {
        printf("Enter a positive integer: ");
        scanf("%d", &n);
        
        sum = 0.0;
        i = 1;
        printf("Harmonic series: ");
        do {
            sum += 1.0 / i;
            printf("1/%d ", i);
            if (i < n) {
                printf("+ ");
            }
            i++;
        } while (i <= n);
        
        printf("\nSum = %.4f\n", sum);
        
        printf("Do you want to calculate for another number? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}