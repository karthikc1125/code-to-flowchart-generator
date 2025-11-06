#include <stdio.h>
#include <math.h>

int main() {
    int number, nextNumber, sqrtNext;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    nextNumber = number + 1;
    sqrtNext = sqrt(nextNumber);
    
    if (sqrtNext * sqrtNext == nextNumber) {
        printf("%d is a sunny number\n", number);
    } else {
        printf("%d is not a sunny number\n", number);
    }
    
    return 0;
}