#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    int x = 48, y = 18;
    int result = gcd(x, y);
    printf("GCD of %d and %d is %d\n", x, y, result);
    return 0;
}