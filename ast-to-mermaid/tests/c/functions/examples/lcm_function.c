#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int lcm(int a, int b) {
    return (a * b) / gcd(a, b);
}

int main() {
    int x = 12, y = 18;
    int result = lcm(x, y);
    printf("LCM of %d and %d is %d\n", x, y, result);
    return 0;
}