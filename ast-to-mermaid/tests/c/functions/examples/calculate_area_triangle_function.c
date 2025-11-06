#include <stdio.h>

float triangleArea(float base, float height) {
    return 0.5 * base * height;
}

int main() {
    float base = 10.0, height = 5.0;
    float area = triangleArea(base, height);
    printf("Area of triangle with base %.2f and height %.2f is %.2f\n", base, height, area);
    return 0;
}