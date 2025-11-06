#include <stdio.h>

int sumOfDigits(int n) {
    int sum = 0;
    for (; n > 0; n /= 10) {
        sum += n % 10;
    }
    return sum;
}

int sumOfPrimeFactors(int n) {
    int sum = 0, temp = n;
    
    for (int i = 2; i <= temp/2; i++) {
        while (temp % i == 0) {
            sum += sumOfDigits(i);
            temp /= i;
        }
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