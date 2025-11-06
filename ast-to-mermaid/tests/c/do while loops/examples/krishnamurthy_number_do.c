#include <stdio.h>

int factorial(int n) {
    int result = 1, i = 1;
    do {
        result *= i;
        i++;
    } while (i <= n);
    return result;
}

int main() {
    int number, original, remainder, sum = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    original = number;
    
    int temp = number;
    do {
        remainder = temp % 10;
        sum += factorial(remainder);
        temp /= 10;
    } while (temp != 0);
    
    if (sum == original) {
        printf("%d is a Krishnamurthy number.\n", original);
    } else {
        printf("%d is not a Krishnamurthy number.\n", original);
    }
    
    return 0;
}