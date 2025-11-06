#include <stdio.h>

int main() {
    float side1, side2, side3;
    
    printf("Enter three sides of a triangle: ");
    scanf("%f %f %f", &side1, &side2, &side3);
    
    if (side1 <= 0 || side2 <= 0 || side3 <= 0) {
        printf("Invalid sides!\n");
    } else if (side1 + side2 <= side3 || side1 + side3 <= side2 || side2 + side3 <= side1) {
        printf("Not a valid triangle!\n");
    } else if (side1 == side2 && side2 == side3) {
        printf("Equilateral triangle\n");
    } else if (side1 == side2 || side1 == side3 || side2 == side3) {
        printf("Isosceles triangle\n");
    } else {
        printf("Scalene triangle\n");
    }
    
    return 0;
}