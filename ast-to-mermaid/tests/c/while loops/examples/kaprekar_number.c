#include <stdio.h>

int countDigits(int n) {
    int count = 0;
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}

int main() {
    int number, square, digits, divisor, leftPart, rightPart;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    square = number * number;
    digits = countDigits(square);
    divisor = 1;
    
    int i = 0;
    while (i < digits/2) {
        divisor *= 10;
        i++;
    }
    
    leftPart = square / divisor;
    rightPart = square % divisor;
    
    if (leftPart + rightPart == number) {
        printf("%d is a Kaprekar number\n", number);
    } else {
        printf("%d is not a Kaprekar number\n", number);
    }
    
    return 0;
}