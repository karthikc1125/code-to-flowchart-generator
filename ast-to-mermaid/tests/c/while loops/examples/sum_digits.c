#include <stdio.h>

int main() {
    int number, sum = 0, remainder;
    
    printf("Enter an integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp != 0) {
        remainder = temp % 10;
        sum += remainder;
        temp /= 10;
    }
    
    printf("Sum of digits of %d = %d\n", number, sum);
    
    return 0;
}