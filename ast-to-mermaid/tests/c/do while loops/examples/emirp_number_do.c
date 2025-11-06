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

int reverseNumber(int n) {
    int reversed = 0;
    do {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    } while (n != 0);
    return reversed;
}

int main() {
    int number, reversed;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    reversed = reverseNumber(number);
    
    if (number != reversed && isPrime(number) && isPrime(reversed)) {
        printf("%d is an Emirp number.\n", number);
    } else {
        printf("%d is not an Emirp number.\n", number);
    }
    
    return 0;
}