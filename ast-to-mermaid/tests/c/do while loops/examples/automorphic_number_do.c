#include <stdio.h>

int main() {
    int number, square, last_digits = 0, multiplier = 1;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    square = number * number;
    
    int temp = number;
    do {
        last_digits += (square % 10) * multiplier;
        multiplier *= 10;
        square /= 10;
        temp /= 10;
    } while (temp != 0);
    
    if (last_digits == number) {
        printf("%d is an Automorphic number.\n", number);
    } else {
        printf("%d is not an Automorphic number.\n", number);
    }
    
    return 0;
}