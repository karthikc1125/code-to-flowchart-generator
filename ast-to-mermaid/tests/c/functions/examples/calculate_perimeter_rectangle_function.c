#include <stdio.h>

float rectanglePerimeter(float length, float width) {
    return 2 * (length + width);
}

int main() {
    float length = 5.5, width = 3.2;
    float perimeter = rectanglePerimeter(length, width);
    printf("Perimeter of rectangle with length %.2f and width %.2f is %.2f\n", length, width, perimeter);
    return 0;
}