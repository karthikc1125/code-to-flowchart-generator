#include <stdio.h>

int main() {
    float side1, side2, side3;
    
    printf("Enter three sides of a triangle: ");
    scanf("%f %f %f", &side1, &side2, &side3);
    
    if (side1 == side2 && side2 == side3) {
        printf("Equilateral Triangle\n");
    } else if (side1 == side2 || side2 == side3 || side1 == side3) {
        printf("Isosceles Triangle\n");
    } else if (side1 != side2 && side2 != side3 && side1 != side3) {
        printf("Scalene Triangle\n");
    } else {
        printf("Invalid triangle\n");
    }
    
    return 0;
}