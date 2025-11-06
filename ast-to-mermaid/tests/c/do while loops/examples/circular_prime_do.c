#include <stdio.h>
#include <math.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    if (n <= 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    
    int i = 5;
    do {
        if (n % i == 0 || n % (i + 2) == 0) {
            return 0;
        }
        i += 6;
    } while (i * i <= n);
    
    return 1;
}

int countDigits(int n) {
    int count = 0;
    do {
        count++;
        n /= 10;
    } while (n != 0);
    return count;
}

int rotateNumber(int n) {
    int digits = countDigits(n);
    int firstDigit = n / (int)pow(10, digits - 1);
    n = n % (int)pow(10, digits - 1);
    n = n * 10 + firstDigit;
    return n;
}

int main() {
    int number, original, rotations, isCircularPrime = 1;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    original = number;
    rotations = countDigits(number);
    
    int i = 0;
    do {
        if (!isPrime(number)) {
            isCircularPrime = 0;
            break;
        }
        number = rotateNumber(number);
        i++;
    } while (i < rotations);
    
    if (isCircularPrime) {
        printf("%d is a Circular Prime.\n", original);
    } else {
        printf("%d is not a Circular Prime.\n", original);
    }
    
    return 0;
}