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
    int number, n = 0;
    int found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    while (n <= 10) {
        long long fermat = pow(2, pow(2, n)) + 1;
        if (fermat == number) {
            found = 1;
            break;
        }
        if (fermat > number) {
            break;
        }
        n++;
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