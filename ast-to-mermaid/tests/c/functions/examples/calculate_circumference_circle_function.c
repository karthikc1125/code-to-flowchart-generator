#include <stdio.h>
#define PI 3.14159

float circleCircumference(float radius) {
    return 2 * PI * radius;
}

int main() {
    float radius = 5.0;
    float circumference = circleCircumference(radius);
    printf("Circumference of circle with radius %.2f is %.2f\n", radius, circumference);
    return 0;
}