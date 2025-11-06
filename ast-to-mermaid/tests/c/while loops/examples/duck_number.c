#include <stdio.h>

int main() {
    int number, hasZero = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp > 0) {
        if (temp % 10 == 0) {
            hasZero = 1;
            break;
        }
        temp /= 10;
    }
    
    if (hasZero && number % 10 != 0) {
        printf("%d is a duck number\n", number);
    } else {
        printf("%d is not a duck number\n", number);
    }
    
    return 0;
}