#include <stdio.h>

int sumOfDigits(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int sumOfPrimeFactors(int n) {
    int sum = 0, i = 2;
    int temp = n;
    
    while (i <= temp/2) {
        while (temp % i == 0) {
            sum += sumOfDigits(i);
            temp /= i;
        }
        i++;
    }
    
    if (temp > 1) {
        sum += sumOfDigits(temp);
    }
    
    return sum;
}

int main() {
    int number;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int digitSum = sumOfDigits(number);
    int factorSum = sumOfPrimeFactors(number);
    
    if (digitSum == factorSum) {
        printf("%d is a Smith number\n", number);
    } else {
        printf("%d is not a Smith number\n", number);
    }
    
    return 0;
}