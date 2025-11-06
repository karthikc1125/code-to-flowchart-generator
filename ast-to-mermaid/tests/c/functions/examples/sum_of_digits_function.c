#include <stdio.h>

int sumOfDigits(int n) {
    int sum = 0;
    n = (n < 0) ? -n : n; // Make positive
    
    while (n != 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int main() {
    int number = 12345;
    int result = sumOfDigits(number);
    printf("Sum of digits in %d is %d\n", number, result);
    return 0;
}