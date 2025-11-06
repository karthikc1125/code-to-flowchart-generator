#include <stdio.h>

int reverseNumber(int n) {
    int reversed = 0;
    while (n != 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    return reversed;
}

int isPalindrome(int n) {
    if (n < 0) return 0; // Negative numbers are not palindromes
    return (n == reverseNumber(n)) ? 1 : 0;
}

int main() {
    int number = 12321;
    if (isPalindrome(number)) {
        printf("%d is a palindrome.\n", number);
    } else {
        printf("%d is not a palindrome.\n", number);
    }
    return 0;
}