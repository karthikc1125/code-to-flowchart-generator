#include <stdio.h>

int main() {
    double num1, num2, result;
    char operator;
    
    printf("Advanced Calculator\n");
    printf("Enter first number: ");
    scanf("%lf", &num1);
    printf("Enter operator (+, -, *, /, %%, ^): ");
    scanf(" %c", &operator);
    printf("Enter second number: ");
    scanf("%lf", &num2);
    
    switch (operator) {
        case '+':
            result = num1 + num2;
            printf("%.2lf + %.2lf = %.2lf\n", num1, num2, result);
            break;
        case '-':
            result = num1 - num2;
            printf("%.2lf - %.2lf = %.2lf\n", num1, num2, result);
            break;
        case '*':
            result = num1 * num2;
            printf("%.2lf * %.2lf = %.2lf\n", num1, num2, result);
            break;
        case '/':
            if (num2 != 0) {
                result = num1 / num2;
                printf("%.2lf / %.2lf = %.2lf\n", num1, num2, result);
            } else {
                printf("Error: Division by zero!\n");
            }
            break;
        case '%':
            if ((int)num2 != 0) {
                result = (int)num1 % (int)num2;
                printf("%.0lf %% %.0lf = %.0lf\n", num1, num2, result);
            } else {
                printf("Error: Modulus by zero!\n");
            }
            break;
        case '^':
            result = 1;
            for (int i = 0; i < (int)num2; i++) {
                result *= num1;
            }
            printf("%.2lf ^ %.0lf = %.2lf\n", num1, num2, result);
            break;
        default:
            printf("Error: Invalid operator!\n");
    }
    
    return 0;
}