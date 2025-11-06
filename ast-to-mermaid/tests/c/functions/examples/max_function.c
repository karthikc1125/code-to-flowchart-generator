#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    int x = 15, y = 23;
    int maximum = max(x, y);
    printf("Maximum of %d and %d is %d\n", x, y, maximum);
    return 0;
}