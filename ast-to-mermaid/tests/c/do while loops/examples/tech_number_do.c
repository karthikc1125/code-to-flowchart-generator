#include <stdio.h>

int main() {
    int number, first_part, second_part, sum, digits = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    int temp = number;
    do {
        digits++;
        temp /= 10;
    } while (temp != 0);
    
    if (digits % 2 != 0) {
        printf("%d is not a Tech number (must have even number of digits).\n", number);
        return 0;
    }
    
    temp = number;
    int divisor = 1;
    int i = 0;
    do {
        divisor *= 10;
        i++;
    } while (i < digits / 2);
    
    first_part = temp / divisor;
    second_part = temp % divisor;
    sum = first_part + second_part;
    
    if (sum * sum == number) {
        printf("%d is a Tech number.\n", number);
    } else {
        printf("%d is not a Tech number.\n", number);
    }
    
    return 0;
}