#include <stdio.h>

int main() {
    int number, square, sum = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    square = number * number;
    
    do {
        sum += square % 10;
        square /= 10;
    } while (square != 0);
    
    if (sum == number) {
        printf("%d is a Neon number.\n", number);
    } else {
        printf("%d is not a Neon number.\n", number);
    }
    
    return 0;
}