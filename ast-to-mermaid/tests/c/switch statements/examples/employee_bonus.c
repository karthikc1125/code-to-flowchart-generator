#include <stdio.h>

int main() {
    int performance, years;
    float salary, bonus;
    
    printf("Employee Bonus Calculator\n");
    printf("Enter salary: $");
    scanf("%f", &salary);
    printf("Enter years of service: ");
    scanf("%d", &years);
    printf("Performance rating (1-5): ");
    scanf("%d", &performance);
    
    if (salary <= 0 || years < 0 || performance < 1 || performance > 5) {
        printf("Invalid input!\n");
        return 0;
    }
    
    switch (performance) {
        case 5:
            bonus = salary * 0.15;
            if (years > 10) bonus *= 1.2;
            printf("Excellent performance bonus: $%.2f\n", bonus);
            break;
        case 4:
            bonus = salary * 0.10;
            if (years > 10) bonus *= 1.1;
            printf("Good performance bonus: $%.2f\n", bonus);
            break;
        case 3:
            bonus = salary * 0.05;
            printf("Average performance bonus: $%.2f\n", bonus);
            break;
        case 2:
            bonus = salary * 0.02;
            printf("Below average performance bonus: $%.2f\n", bonus);
            break;
        case 1:
            bonus = salary * 0.01;
            printf("Poor performance bonus: $%.2f\n", bonus);
            break;
        default:
            printf("Invalid performance rating!\n");
    }
    
    return 0;
}