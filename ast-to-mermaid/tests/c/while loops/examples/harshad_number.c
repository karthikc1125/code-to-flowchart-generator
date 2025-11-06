#include <stdio.h>

int main() {
    int number, sum = 0, remainder;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp > 0) {
        remainder = temp % 10;
        sum += remainder;
        temp /= 10;
    }
    
    if (number % sum == 0) {
        printf("%d is a Harshad number\n", number);
    } else {
        printf("%d is not a Harshad number\n", number);
    }
    
    return 0;
}