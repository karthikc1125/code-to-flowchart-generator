#include <stdio.h>

int main() {
    int number, remainder, factorial, sum = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp > 0) {
        remainder = temp % 10;
        factorial = 1;
        int i = 1;
        while (i <= remainder) {
            factorial *= i;
            i++;
        }
        sum += factorial;
        temp /= 10;
    }
    
    if (sum == number) {
        printf("%d is a strong number\n", number);
    } else {
        printf("%d is not a strong number\n", number);
    }
    
    return 0;
}