#include <stdio.h>

int main() {
    int number, i = 2, isPrime = 1;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    if (number <= 1) {
        isPrime = 0;
    } else {
        while (i <= number / 2) {
            if (number % i == 0) {
                isPrime = 0;
                break;
            }
            i++;
        }
    }
    
    if (isPrime) {
        printf("%d is a prime number.\n", number);
    } else {
        printf("%d is not a prime number.\n", number);
    }
    
    return 0;
}