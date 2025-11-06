#include <stdio.h>

int main() {
    int number, factorial = 1, i = 1;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    do {
        factorial *= i;
        i++;
    } while (i <= number);
    
    printf("Factorial of %d = %d\n", number, factorial);
    
    return 0;
}