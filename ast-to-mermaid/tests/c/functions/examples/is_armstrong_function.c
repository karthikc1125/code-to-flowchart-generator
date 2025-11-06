#include <stdio.h>
#include <math.h>

int countDigits(int n) {
    if (n == 0) return 1;
    int count = 0;
    while (n != 0) {
        count++;
        n /= 10;
    }
    return count;
}

int isArmstrong(int n) {
    int original = n;
    int digits = countDigits(n);
    int sum = 0;
    
    while (n != 0) {
        int digit = n % 10;
        sum += pow(digit, digits);
        n /= 10;
    }
    
    return (sum == original) ? 1 : 0;
}

int main() {
    int number = 153;
    if (isArmstrong(number)) {
        printf("%d is an Armstrong number.\n", number);
    } else {
        printf("%d is not an Armstrong number.\n", number);
    }
    return 0;
}