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
    
    for (int n = 0; n <= 10; n++) {
        long long fermat = pow(2, pow(2, n)) + 1;
        if (fermat == number) {
            found = 1;
            break;
        }
        if (fermat > number) {
            break;
        }
    }
    
    if (found) {
        printf("%d is a Fermat number\n", number);
        if (isPrime(number)) {
            printf("%d is also a Fermat prime\n", number);
        }
    } else {
        printf("%d is not a Fermat number\n", number);
    }
    
    return 0;
}