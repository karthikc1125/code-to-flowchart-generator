#include <stdio.h>

int main() {
    int number, hasZero = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int temp = number; temp > 0; temp /= 10) {
        if (temp % 10 == 0) {
            hasZero = 1;
            break;
        }
    }
    
    if (hasZero && number % 10 != 0) {
        printf("%d is a duck number\n", number);
    } else {
        printf("%d is not a duck number\n", number);
    }
    
    return 0;
}