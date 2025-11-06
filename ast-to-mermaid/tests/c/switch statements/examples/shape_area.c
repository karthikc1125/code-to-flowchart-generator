#include <stdio.h>

int main() {
    int shape;
    float area, radius, length, width, base, height;
    
    printf("Shape Area Calculator\n");
    printf("1. Circle\n2. Rectangle\n3. Triangle\n4. Square\n");
    printf("Select shape: ");
    scanf("%d", &shape);
    
    switch (shape) {
        case 1:
            printf("Enter radius: ");
            scanf("%f", &radius);
            area = 3.14159 * radius * radius;
            printf("Area of circle: %.2f\n", area);
            break;
        case 2:
            printf("Enter length: ");
            scanf("%f", &length);
            printf("Enter width: ");
            scanf("%f", &width);
            area = length * width;
            printf("Area of rectangle: %.2f\n", area);
            break;
        case 3:
            printf("Enter base: ");
            scanf("%f", &base);
            printf("Enter height: ");
            scanf("%f", &height);
            area = 0.5 * base * height;
            printf("Area of triangle: %.2f\n", area);
            break;
        case 4:
            printf("Enter side: ");
            scanf("%f", &length);
            area = length * length;
            printf("Area of square: %.2f\n", area);
            break;
        default:
            printf("Invalid shape selection!\n");
    }
    
    return 0;
}