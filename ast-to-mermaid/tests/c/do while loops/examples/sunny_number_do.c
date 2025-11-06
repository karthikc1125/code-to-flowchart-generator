#include <stdio.h>
#include <math.h>

int main() {
    int number, next_number, sqrt_val;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    next_number = number + 1;
    sqrt_val = sqrt(next_number);
    
    if (sqrt_val * sqrt_val == next_number) {
        printf("%d is a Sunny number.\n", number);
    } else {
        printf("%d is not a Sunny number.\n", number);
    }
    
    return 0;
}