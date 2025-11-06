#include <stdio.h>

int main() {
    double num1, num2, result;
    char operator;
    int continueCalc;
    
    do {
        printf("Enter first number: ");
        scanf("%lf", &num1);
        
        printf("Enter an operator (+, -, *, /): ");
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
                    printf("Error! Division by zero.\n");
                }
                break;
            default:
                printf("Error! Invalid operator.\n");
        }
        
        printf("Do you want to continue? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}