#include <stdio.h>

int main() {
    int choice;
    double num1, num2, result;
    
    printf("Math Operations Calculator\n");
    printf("1. Addition\n2. Subtraction\n3. Multiplication\n4. Division\n5. Modulus\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter first number: ");
    scanf("%lf", &num1);
    printf("Enter second number: ");
    scanf("%lf", &num2);
    
    switch (choice) {
        case 1:
            result = num1 + num2;
            printf("%.2lf + %.2lf = %.2lf\n", num1, num2, result);
            break;
        case 2:
            result = num1 - num2;
            printf("%.2lf - %.2lf = %.2lf\n", num1, num2, result);
            break;
        case 3:
            result = num1 * num2;
            printf("%.2lf * %.2lf = %.2lf\n", num1, num2, result);
            break;
        case 4:
            if (num2 != 0) {
                result = num1 / num2;
                printf("%.2lf / %.2lf = %.2lf\n", num1, num2, result);
            } else {
                printf("Error: Division by zero!\n");
            }
            break;
        case 5:
            if ((int)num2 != 0) {
                result = (int)num1 % (int)num2;
                printf("%.0lf %% %.0lf = %.0lf\n", num1, num2, result);
            } else {
                printf("Error: Modulus by zero!\n");
            }
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}