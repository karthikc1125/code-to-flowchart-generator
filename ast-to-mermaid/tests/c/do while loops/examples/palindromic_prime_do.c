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

int isPalindrome(int n) {
    int reversed = 0, original = n;
    do {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    } while (n != 0);
    
    return (original == reversed);
}

int main() {
    int number;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    if (isPrime(number) && isPalindrome(number)) {
        printf("%d is a Palindromic Prime.\n", number);
    } else {
        printf("%d is not a Palindromic Prime.\n", number);
    }
    
    return 0;
}