#include <stdio.h>

int main() {
    int number, reversed = 0, remainder;
    
    printf("Enter an integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp != 0) {
        remainder = temp % 10;
        reversed = reversed * 10 + remainder;
        temp /= 10;
    }
    
    printf("Reversed number = %d\n", reversed);
    
    return 0;
}