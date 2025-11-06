#include <stdio.h>

int modulus(int a, int b) {
    if (b != 0) {
        return a % b;
    } else {
        printf("Error: Modulus by zero!\n");
        return 0;
    }
}

int main() {
    int x = 17, y = 5;
    int result = modulus(x, y);
    printf("Remainder of %d divided by %d is %d\n", x, y, result);
    return 0;
}