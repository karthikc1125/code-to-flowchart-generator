#include <stdio.h>
#include <math.h>

int countDigits(int n) {
    int count = 0;
    for (; n > 0; n /= 10) {
        count++;
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
    
    int divisor = pow(10, digits/2);
    
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