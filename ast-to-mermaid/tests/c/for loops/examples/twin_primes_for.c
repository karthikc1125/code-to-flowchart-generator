#include <stdio.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i <= n/2; i++) {
        if (n % i == 0) {
            return 0;
        }
    }
    return 1;
}

int main() {
    int limit;
    
    printf("Enter the limit: ");
    scanf("%d", &limit);
    
    printf("Twin primes up to %d:\n", limit);
    for (int i = 2; i <= limit - 2; i++) {
        if (isPrime(i) && isPrime(i + 2)) {
            printf("(%d, %d) ", i, i + 2);
        }
    }
    printf("\n");
    
    return 0;
}