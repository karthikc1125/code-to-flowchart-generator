#include <stdio.h>

int main() {
    int n;
    double sum = 0.0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    
    printf("Harmonic series: ");
    for (int i = 1; i <= n; i++) {
        sum += 1.0 / i;
        printf("1/%d ", i);
        if (i < n) {
            printf("+ ");
        }
    }
    
    printf("\nSum = %.4f\n", sum);
    
    return 0;
}