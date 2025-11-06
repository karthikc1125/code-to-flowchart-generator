#include <stdio.h>

int main() {
    int num1, num2, choice;
    
    printf("Enter two numbers: ");
    scanf("%d %d", &num1, &num2);
    
    printf("\nSelect operation:\n");
    printf("1. Addition\n");
    printf("2. Subtraction\n");
    printf("3. Multiplication\n");
    printf("4. Division\n");
    printf("Enter your choice (1-4): ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("%d + %d = %d\n", num1, num2, num1 + num2);
            break;
        case 2:
            printf("%d - %d = %d\n", num1, num2, num1 - num2);
            break;
        case 3:
            printf("%d * %d = %d\n", num1, num2, num1 * num2);
            break;
        case 4:
            if (num2 != 0) {
                printf("%d / %d = %.2f\n", num1, num2, (float)num1 / num2);
            } else {
                printf("Error! Division by zero.\n");
            }
            break;
        default:
            printf("Invalid choice. Please select a valid option (1-4).\n");
    }
    
    return 0;
}