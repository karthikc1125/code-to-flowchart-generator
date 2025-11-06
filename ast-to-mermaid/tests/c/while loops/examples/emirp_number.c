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

int reverseNumber(int n) {
    int reversed = 0;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
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