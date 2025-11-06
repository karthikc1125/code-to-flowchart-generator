#include <stdio.h>

int isPerfectNumber(int n) {
    if (n <= 1) return 0;
    
    int sum = 0;
    for (int i = 1; i < n; i++) {
        if (n % i == 0) {
            sum += i;
        }
    }
    
    return (sum == n) ? 1 : 0;
}

int main() {
    int number = 28;
    if (isPerfectNumber(number)) {
        printf("%d is a perfect number.\n", number);
    } else {
        printf("%d is not a perfect number.\n", number);
    }
    return 0;
}