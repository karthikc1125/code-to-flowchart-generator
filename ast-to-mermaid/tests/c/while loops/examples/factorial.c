#include <stdio.h>

int main() {
    int number, factorial = 1;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp > 0) {
        factorial *= temp;
        temp--;
    }
    
    printf("Factorial of %d = %d\n", number, factorial);
    
    return 0;
}