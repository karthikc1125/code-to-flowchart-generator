#include <stdio.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    
    int i = 5;
    do {
        if (n % i == 0 || n % (i + 2) == 0) {
            return 0;
        }
        i += 6;
    } while (i * i <= n);
    
    return 1;
}

int main() {
    int num1, num2;
    
    printf("Enter two numbers: ");
    scanf("%d %d", &num1, &num2);
    
    if (isPrime(num1) && isPrime(num2) && (num2 - num1 == 2 || num1 - num2 == 2)) {
        printf("%d and %d are Twin Primes.\n", num1, num2);
    } else {
        printf("%d and %d are not Twin Primes.\n", num1, num2);
    }
    
    return 0;
}