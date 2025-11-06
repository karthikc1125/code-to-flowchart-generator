#include <stdio.h>

int main() {
    int n, i = 1;
    double sum = 0.0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    
    printf("Harmonic series: ");
    while (i <= n) {
        sum += 1.0 / i;
        printf("1/%d ", i);
        if (i < n) {
            printf("+ ");
        }
        i++;
    }
    
    printf("\nSum = %.4f\n", sum);
    
    return 0;
}