#include <stdio.h>

int main() {
    int choice;
    float area, perimeter, radius, length, width, base, height;
    
    printf("Shape Calculator\n");
    printf("1. Circle\n2. Rectangle\n3. Triangle\n4. Square\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("Enter radius: ");
            scanf("%f", &radius);
            area = 3.14159 * radius * radius;
            perimeter = 2 * 3.14159 * radius;
            printf("Circle - Area: %.2f, Perimeter: %.2f\n", area, perimeter);
            break;
        case 2:
            printf("Enter length: ");
            scanf("%f", &length);
            printf("Enter width: ");
            scanf("%f", &width);
            area = length * width;
            perimeter = 2 * (length + width);
            printf("Rectangle - Area: %.2f, Perimeter: %.2f\n", area, perimeter);
            break;
        case 3:
            printf("Enter base: ");
            scanf("%f", &base);
            printf("Enter height: ");
            scanf("%f", &height);
            area = 0.5 * base * height;
            printf("Triangle - Area: %.2f\n", area);
            break;
        case 4:
            printf("Enter side: ");
            scanf("%f", &length);
            area = length * length;
            perimeter = 4 * length;
            printf("Square - Area: %.2f, Perimeter: %.2f\n", area, perimeter);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}