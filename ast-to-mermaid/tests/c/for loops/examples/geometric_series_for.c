#include <stdio.h>

int main() {
    int n;
    double a, r, sum = 0.0, term;
    
    printf("Enter first term (a): ");
    scanf("%lf", &a);
    
    printf("Enter common ratio (r): ");
    scanf("%lf", &r);
    
    printf("Enter number of terms: ");
    scanf("%d", &n);
    
    printf("Geometric series: ");
    for (int i = 0; i < n; i++) {
        term = a * pow(r, i);
        sum += term;
        printf("%.2f ", term);
        if (i < n - 1) {
            printf("+ ");
        }
    }
    
    printf("\nSum = %.4f\n", sum);
    
    return 0;
}