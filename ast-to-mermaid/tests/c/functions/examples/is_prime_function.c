#include <stdio.h>
#include <math.h>

int isPrime(int n) {
    if (n <= 1) {
        return 0; // Not prime
    }
    
    if (n <= 3) {
        return 1; // 2 and 3 are prime
    }
    
    if (n % 2 == 0 || n % 3 == 0) {
        return 0; // Divisible by 2 or 3
    }
    
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return 0;
        }
    }
    
    return 1; // Prime
}

int main() {
    int number = 17;
    if (isPrime(number)) {
        printf("%d is a prime number.\n", number);
    } else {
        printf("%d is not a prime number.\n", number);
    }
    return 0;
}