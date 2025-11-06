#include <stdio.h>
#include <math.h>

int main() {
    double a = 1, b = -5, c = 6; // Coefficients of ax^2 + bx + c = 0
    double discriminant, root1, root2;
    
    discriminant = b * b - 4 * a * c;
    
    if (discriminant > 0) {
        root1 = (-b + sqrt(discriminant)) / (2 * a);
        root2 = (-b - sqrt(discriminant)) / (2 * a);
        printf("Roots are real and different: %.2f and %.2f\n", root1, root2);
    } else if (discriminant == 0) {
        root1 = root2 = -b / (2 * a);
        printf("Roots are real and same: %.2f\n", root1);
    } else {
        printf("Roots are complex and different.\n");
    }
    
    return 0;
}