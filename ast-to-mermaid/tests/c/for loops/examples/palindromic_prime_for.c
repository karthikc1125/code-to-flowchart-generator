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

int isPalindrome(int n) {
    int reversed = 0, remainder, temp = n;
    for (; temp > 0; temp /= 10) {
        remainder = temp % 10;
        reversed = reversed * 10 + remainder;
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