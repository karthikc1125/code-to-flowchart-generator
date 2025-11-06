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

int reverseNumber(int n) {
    int reversed = 0;
    for (; n > 0; n /= 10) {
        reversed = reversed * 10 + n % 10;
    }
    return reversed;
}

int main() {
    int number, reversed;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    reversed = reverseNumber(number);
    
    if (isPrime(number) && isPrime(reversed) && number != reversed) {
        printf("%d is an emirp number\n", number);
    } else {
        printf("%d is not an emirp number\n", number);
    }
    
    return 0;
}