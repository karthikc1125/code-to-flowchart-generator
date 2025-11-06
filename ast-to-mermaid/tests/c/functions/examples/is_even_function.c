#include <stdio.h>

int isEven(int n) {
    return (n % 2 == 0) ? 1 : 0;
}

int main() {
    int number = 42;
    if (isEven(number)) {
        printf("%d is an even number.\n", number);
    } else {
        printf("%d is an odd number.\n", number);
    }
    return 0;
}