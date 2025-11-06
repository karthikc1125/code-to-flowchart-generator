#include <stdio.h>

int main() {
    int number, hasZero = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    // Skip the first digit
    number /= 10;
    
    do {
        if (number % 10 == 0) {
            hasZero = 1;
            break;
        }
        number /= 10;
    } while (number != 0);
    
    if (hasZero) {
        printf("It is a Duck number.\n");
    } else {
        printf("It is not a Duck number.\n");
    }
    
    return 0;
}