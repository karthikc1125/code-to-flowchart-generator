#include <stdio.h>
#include <math.h>

int main() {
    int number, original, remainder, n = 0, result = 0;
    
    printf("Enter an integer: ");
    scanf("%d", &number);
    
    original = number;
    
    // Count digits
    int temp = number;
    while (temp != 0) {
        temp /= 10;
        ++n;
    }
    
    temp = number;
    while (temp != 0) {
        remainder = temp % 10;
        result += pow(remainder, n);
        temp /= 10;
    }
    
    if (result == original) {
        printf("%d is an Armstrong number.\n", original);
    } else {
        printf("%d is not an Armstrong number.\n", original);
    }
    
    return 0;
}