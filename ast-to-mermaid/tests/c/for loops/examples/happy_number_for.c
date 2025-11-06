#include <stdio.h>

int main() {
    int number, sum = 0, remainder;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    for (; sum != 1 && sum != 4; ) {
        sum = 0;
        for (; temp > 0; temp /= 10) {
            remainder = temp % 10;
            sum += (remainder * remainder);
        }
        temp = sum;
    }
    
    if (sum == 1) {
        printf("%d is a happy number\n", number);
    } else {
        printf("%d is not a happy number\n", number);
    }
    
    return 0;
}