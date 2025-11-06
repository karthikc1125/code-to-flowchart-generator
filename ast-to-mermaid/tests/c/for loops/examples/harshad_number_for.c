#include <stdio.h>

int main() {
    int number, sum = 0, remainder;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int temp = number; temp > 0; temp /= 10) {
        remainder = temp % 10;
        sum += remainder;
    }
    
    if (number % sum == 0) {
        printf("%d is a Harshad number\n", number);
    } else {
        printf("%d is not a Harshad number\n", number);
    }
    
    return 0;
}