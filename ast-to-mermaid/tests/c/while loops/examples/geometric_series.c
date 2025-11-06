#include <stdio.h>

int main() {
    int n, i = 0;
    double a, r, sum = 0.0, term;
    
    printf("Enter first term (a): ");
    scanf("%lf", &a);
    
    printf("Enter common ratio (r): ");
    scanf("%lf", &r);
    
    printf("Enter number of terms: ");
    scanf("%d", &n);
    
    term = a;
    printf("Geometric series: ");
    while (i < n) {
        sum += term;
        printf("%.2f ", term);
        if (i < n - 1) {
            printf("+ ");
        }
        term *= r;
        i++;
    }
    
    printf("\nSum = %.4f\n", sum);
    
    return 0;
}