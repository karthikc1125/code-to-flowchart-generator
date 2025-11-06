#include <stdio.h>
#include <math.h>

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
    int number, p = 2;
    int found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    while (p <= number) {
        long long mersenne = pow(2, p) - 1;
        if (mersenne == number && isPrime(number)) {
            found = 1;
            break;
        }
        if (mersenne > number) {
            break;
        }
        p++;
    }
    
    if (found) {
        printf("%d is a Mersenne prime\n", number);
    } else {
        printf("%d is not a Mersenne prime\n", number);
    }
    
    return 0;
}