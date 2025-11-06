#include <stdio.h>

int main() {
    int decimal, binary = 0, base = 1, remainder;
    
    printf("Enter a decimal number: ");
    scanf("%d", &decimal);
    
    int temp = decimal;
    while (temp > 0) {
        remainder = temp % 2;
        binary += remainder * base;
        base *= 10;
        temp /= 2;
    }
    
    printf("Binary equivalent of %d = %d\n", decimal, binary);
    
    return 0;
}