#include <stdio.h>

int main() {
    int choice;
    float result, param1, param2;
    
    printf("Geometry Calculator\n");
    printf("1. Circle Area\n2. Rectangle Area\n3. Triangle Area\n4. Circle Circumference\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("Enter radius: ");
            scanf("%f", &param1);
            result = 3.14159 * param1 * param1;
            printf("Circle area: %.2f\n", result);
            break;
        case 2:
            printf("Enter length: ");
            scanf("%f", &param1);
            printf("Enter width: ");
            scanf("%f", &param2);
            result = param1 * param2;
            printf("Rectangle area: %.2f\n", result);
            break;
        case 3:
            printf("Enter base: ");
            scanf("%f", &param1);
            printf("Enter height: ");
            scanf("%f", &param2);
            result = 0.5 * param1 * param2;
            printf("Triangle area: %.2f\n", result);
            break;
        case 4:
            printf("Enter radius: ");
            scanf("%f", &param1);
            result = 2 * 3.14159 * param1;
            printf("Circle circumference: %.2f\n", result);
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}