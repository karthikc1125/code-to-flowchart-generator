#include <stdio.h>

float divide(float a, float b) {
    if (b != 0) {
        return a / b;
    } else {
        printf("Error: Division by zero!\n");
        return 0;
    }
}

int main() {
    float x = 15.0, y = 3.0;
    float result = divide(x, y);
    printf("Division of %.2f by %.2f is %.2f\n", x, y, result);
    return 0;
}