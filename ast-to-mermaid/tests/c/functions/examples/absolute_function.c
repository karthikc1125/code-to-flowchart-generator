#include <stdio.h>

int absolute(int n) {
    return (n < 0) ? -n : n;
}

int main() {
    int number = -15;
    int result = absolute(number);
    printf("Absolute value of %d is %d\n", number, result);
    return 0;
}