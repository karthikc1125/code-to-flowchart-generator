#include <stdio.h>
#include <math.h>

int main() {
    float a, b, c, discriminant, root1, root2, realPart, imaginaryPart;
    
    printf("Quadratic Equation Solver (ax² + bx + c = 0)\n");
    printf("Enter coefficients a, b and c: ");
    scanf("%f %f %f", &a, &b, &c);
    
    if (a == 0) {
        printf("Not a quadratic equation (a cannot be 0)\n");
    } else {
        discriminant = b * b - 4 * a * c;
        
        if (discriminant > 0) {
            root1 = (-b + sqrt(discriminant)) / (2 * a);
            root2 = (-b - sqrt(discriminant)) / (2 * a);
            printf("Roots are real and different:\n");
            printf("Root 1 = %.2f\n", root1);
            printf("Root 2 = %.2f\n", root2);
        } else if (discriminant == 0) {
            root1 = -b / (2 * a);
            printf("Roots are real and same:\n");
            printf("Root = %.2f\n", root1);
        } else {
            realPart = -b / (2 * a);
            imaginaryPart = sqrt(-discriminant) / (2 * a);
            printf("Roots are complex:\n");
            printf("Root 1 = %.2f + %.2fi\n", realPart, imaginaryPart);
            printf("Root 2 = %.2f - %.2fi\n", realPart, imaginaryPart);
        }
    }
    
    return 0;
}