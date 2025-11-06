#include <stdio.h>
#include <math.h>

int main() {
    int number, original, remainder, result = 0, n = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    original = number;
    
    // Count number of digits
    int temp = number;
    do {
        temp /= 10;
        n++;
    } while (temp != 0);
    
    temp = number;
    do {
        remainder = temp % 10;
        result += pow(remainder, n);
        temp /= 10;
    } while (temp != 0);
    
    if (result == original) {
        printf("%d is an Armstrong number.\n", original);
    } else {
        printf("%d is not an Armstrong number.\n", original);
    }
    
    return 0;
}