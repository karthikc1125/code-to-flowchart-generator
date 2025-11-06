#include <stdio.h>

int main() {
    int number, sum = 0, remainder;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    for (; temp > 0 || sum > 9; ) {
        if (temp == 0) {
            temp = sum;
            sum = 0;
        }
        remainder = temp % 10;
        sum += remainder;
        temp /= 10;
    }
    
    if (sum == 1) {
        printf("%d is a magic number\n", number);
    } else {
        printf("%d is not a magic number\n", number);
    }
    
    return 0;
}