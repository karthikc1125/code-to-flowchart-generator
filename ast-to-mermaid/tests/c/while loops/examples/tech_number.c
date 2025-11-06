#include <stdio.h>

int countDigits(int n) {
    int count = 0;
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}

int main() {
    int number, firstHalf, secondHalf, sum, squaredSum;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int digits = countDigits(number);
    if (digits % 2 != 0) {
        printf("%d is not a tech number (must have even number of digits)\n", number);
        return 0;
    }
    
    int divisor = 1;
    int i = 0;
    while (i < digits/2) {
        divisor *= 10;
        i++;
    }
    
    firstHalf = number / divisor;
    secondHalf = number % divisor;
    sum = firstHalf + secondHalf;
    squaredSum = sum * sum;
    
    if (squaredSum == number) {
        printf("%d is a tech number\n", number);
    } else {
        printf("%d is not a tech number\n", number);
    }
    
    return 0;
}