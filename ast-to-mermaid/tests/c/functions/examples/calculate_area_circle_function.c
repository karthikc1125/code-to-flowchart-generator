#include <stdio.h>
#define PI 3.14159

float circleArea(float radius) {
    return PI * radius * radius;
}

int main() {
    float radius = 5.0;
    float area = circleArea(radius);
    printf("Area of circle with radius %.2f is %.2f\n", radius, area);
    return 0;
}