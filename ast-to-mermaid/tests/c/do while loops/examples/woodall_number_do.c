#include <stdio.h>
#include <math.h>

int main() {
    int n, i = 1;
    
    printf("Enter the number of Woodall numbers to generate: ");
    scanf("%d", &n);
    
    do {
        long long woodall = i * pow(2, i) - 1;
        printf("Woodall number W(%d) = %lld\n", i, woodall);
        i++;
    } while (i <= n);
    
    return 0;
}