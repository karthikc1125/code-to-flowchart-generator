#include <stdio.h>
#include <math.h>

int main() {
    int n, i;
    double a, r, sum, term;
    int continueCalc;
    
    do {
        printf("Enter first term (a): ");
        scanf("%lf", &a);
        
        printf("Enter common ratio (r): ");
        scanf("%lf", &r);
        
        printf("Enter number of terms: ");
        scanf("%d", &n);
        
        sum = 0.0;
        i = 0;
        printf("Geometric series: ");
        do {
            term = a * pow(r, i);
            sum += term;
            printf("%.2f ", term);
            if (i < n - 1) {
                printf("+ ");
            }
            i++;
        } while (i < n);
        
        printf("\nSum = %.4f\n", sum);
        
        printf("Do you want to calculate another series? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}