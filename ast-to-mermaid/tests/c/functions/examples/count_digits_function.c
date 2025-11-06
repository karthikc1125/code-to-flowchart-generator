#include <stdio.h>

int countDigits(int n) {
    if (n == 0) return 1;
    
    int count = 0;
    n = (n < 0) ? -n : n; // Make positive
    
    while (n != 0) {
        count++;
        n /= 10;
    }
    return count;
}

int main() {
    int number = 12345;
    int result = countDigits(number);
    printf("Number of digits in %d is %d\n", number, result);
    return 0;
}