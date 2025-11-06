#include <stdio.h>

int main() {
    int number, square, sum = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    square = number * number;
    int temp = square;
    while (temp > 0) {
        sum += temp % 10;
        temp /= 10;
    }
    
    if (sum == number) {
        printf("%d is a neon number\n", number);
    } else {
        printf("%d is not a neon number\n", number);
    }
    
    return 0;
}