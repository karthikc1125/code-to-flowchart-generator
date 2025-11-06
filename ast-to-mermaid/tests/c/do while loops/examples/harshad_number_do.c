#include <stdio.h>

int main() {
    int number, original, remainder, sum = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    original = number;
    
    int temp = number;
    do {
        remainder = temp % 10;
        sum += remainder;
        temp /= 10;
    } while (temp != 0);
    
    if (original % sum == 0) {
        printf("%d is a Harshad number.\n", original);
    } else {
        printf("%d is not a Harshad number.\n", original);
    }
    
    return 0;
}