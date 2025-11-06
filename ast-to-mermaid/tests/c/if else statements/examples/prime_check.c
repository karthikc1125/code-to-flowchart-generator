#include <stdio.h>

int main() {
    int num = 17;
    int is_prime = 1; // Assume prime initially
    
    if (num <= 1) {
        is_prime = 0;
    } else {
        for (int i = 2; i * i <= num; i++) {
            if (num % i == 0) {
                is_prime = 0;
                break;
            }
        }
    }
    
    if (is_prime) {
        printf("%d is a prime number.\n", num);
    } else {
        printf("%d is not a prime number.\n", num);
    }
    
    return 0;
}