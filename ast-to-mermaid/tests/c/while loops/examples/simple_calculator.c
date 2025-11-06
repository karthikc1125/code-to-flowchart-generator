#include <stdio.h>

int main() {
    char operator;
    double num1, num2, result;
    int continueCalc = 1;
    
    while (continueCalc) {
        printf("Enter an operator (+, -, *, /) or 'q' to quit: ");
        scanf(" %c", &operator);
        
        if (operator == 'q') {
            break;
        }
        
        printf("Enter two operands: ");
        scanf("%lf %lf", &num1, &num2);
        
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 != 0) {
                    result = num1 / num2;
                } else {
                    printf("Error! Division by zero.\n");
                    continue;
                }
                break;
            default:
                printf("Error! Invalid operator.\n");
                continue;
        }
        
        printf("%.2lf %c %.2lf = %.2lf\n", num1, operator, num2, result);
    }
    
    return 0;
}