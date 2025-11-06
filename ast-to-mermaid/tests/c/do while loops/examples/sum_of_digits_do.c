#include <stdio.h>

int main() {
    int number, sum = 0, digit;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    int temp = number;
    do {
        digit = temp % 10;
        sum += digit;
        temp /= 10;
    } while (temp != 0);
    
    printf("Sum of digits of %d is %d\n", number, sum);
    
    return 0;
}