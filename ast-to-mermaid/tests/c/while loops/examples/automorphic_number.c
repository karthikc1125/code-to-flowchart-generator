#include <stdio.h>

int main() {
    int number, square, lastDigitNumber = 0, lastDigitSquare = 0, multiplier = 1;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    square = number * number;
    int tempNumber = number;
    int tempSquare = square;
    
    while (tempNumber > 0) {
        lastDigitNumber = tempNumber % 10;
        lastDigitSquare = tempSquare % 10;
        
        if (lastDigitNumber != lastDigitSquare) {
            printf("%d is not an automorphic number\n", number);
            return 0;
        }
        
        tempNumber /= 10;
        tempSquare /= 10;
    }
    
    printf("%d is an automorphic number\n", number);
    
    return 0;
}