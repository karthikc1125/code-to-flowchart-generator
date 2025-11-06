#include <stdio.h>

float rectangleArea(float length, float width) {
    return length * width;
}

int main() {
    float length = 5.5, width = 3.2;
    float area = rectangleArea(length, width);
    printf("Area of rectangle with length %.2f and width %.2f is %.2f\n", length, width, area);
    return 0;
}