#include <stdio.h>
#include <math.h>

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
    int number, found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int p = 2; p <= number; p++) {
        long long mersenne = pow(2, p) - 1;
        if (mersenne == number && isPrime(number)) {
            found = 1;
            break;
        }
        if (mersenne > number) {
            break;
        }
    }
    
    if (found) {
        printf("%d is a Mersenne prime\n", number);
    } else {
        printf("%d is not a Mersenne prime\n", number);
    }
    
    return 0;
}