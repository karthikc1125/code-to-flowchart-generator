#include <stdio.h>

int main() {
    int number, remainder, factorial, sum = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int temp = number; temp > 0; temp /= 10) {
        remainder = temp % 10;
        factorial = 1;
        for (int i = 1; i <= remainder; i++) {
            factorial *= i;
        }
        sum += factorial;
    }
    
    if (sum == number) {
        printf("%d is a Krishnamurthy number\n", number);
    } else {
        printf("%d is not a Krishnamurthy number\n", number);
    }
    
    return 0;
}