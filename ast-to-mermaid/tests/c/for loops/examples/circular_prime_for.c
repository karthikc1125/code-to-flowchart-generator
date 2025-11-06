#include <stdio.h>
#include <math.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i <= n/2; i++) {
        if (n % i == 0) {
            return 0;
        }
    }
    return 1;
}

int countDigits(int n) {
    int count = 0;
    for (; n > 0; n /= 10) {
        count++;
    }
    return count;
}

int main() {
    int number, digits, divisor, rotated, isCircular = 1;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    int temp = number;
    for (; temp > 0; ) {
        if (!isPrime(temp)) {
            isCircular = 0;
            break;
        }
        
        digits = countDigits(temp);
        divisor = pow(10, digits - 1);
        rotated = (temp % divisor) * 10 + (temp / divisor);
        temp = rotated;
        
        if (temp == number) break;
    }
    
    if (isCircular) {
        printf("%d is a circular prime\n", number);
    } else {
        printf("%d is not a circular prime\n", number);
    }
    
    return 0;
}