#include <stdio.h>

int reverseNumber(int n) {
    int reversed = 0;
    while (n != 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    return reversed;
}

int main() {
    int number = 12345;
    int result = reverseNumber(number);
    printf("Reverse of %d is %d\n", number, result);
    return 0;
}