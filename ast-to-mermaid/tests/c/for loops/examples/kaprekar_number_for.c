#include <stdio.h>
#include <math.h>

int countDigits(int n) {
    int count = 0;
    for (; n > 0; n /= 10) {
        count++;
    }
    return count;
}

int main() {
    int number, square, digits, divisor, leftPart, rightPart;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    square = number * number;
    digits = countDigits(square);
    divisor = pow(10, digits/2);
    
    leftPart = square / divisor;
    rightPart = square % divisor;
    
    if (leftPart + rightPart == number) {
        printf("%d is a Kaprekar number\n", number);
    } else {
        printf("%d is not a Kaprekar number\n", number);
    }
    
    return 0;
}