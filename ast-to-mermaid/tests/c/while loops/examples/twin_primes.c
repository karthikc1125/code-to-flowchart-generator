#include <stdio.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    int i = 2;
    while (i <= n/2) {
        if (n % i == 0) {
            return 0;
        }
        i++;
    }
    return 1;
}

int main() {
    int limit, i = 2;
    
    printf("Enter the limit: ");
    scanf("%d", &limit);
    
    printf("Twin primes up to %d:\n", limit);
    while (i <= limit - 2) {
        if (isPrime(i) && isPrime(i + 2)) {
            printf("(%d, %d) ", i, i + 2);
        }
        i++;
    }
    printf("\n");
    
    return 0;
}