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

int isPalindrome(int n) {
    int reversed = 0, remainder, temp = n;
    while (temp > 0) {
        remainder = temp % 10;
        reversed = reversed * 10 + remainder;
        temp /= 10;
    }
    return (n == reversed);
}

int main() {
    int number;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    if (isPrime(number) && isPalindrome(number)) {
        printf("%d is a palindromic prime\n", number);
    } else {
        printf("%d is not a palindromic prime\n", number);
    }
    
    return 0;
}