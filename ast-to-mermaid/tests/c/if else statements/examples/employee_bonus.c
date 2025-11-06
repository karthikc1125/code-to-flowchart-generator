#include <stdio.h>

int main() {
    float salary, experience, bonus;
    
    printf("Enter your salary: $");
    scanf("%f", &salary);
    printf("Enter your experience (years): ");
    scanf("%f", &experience);
    
    if (salary < 0 || experience < 0) {
        printf("Invalid input!\n");
    } else if (experience >= 10) {
        bonus = salary * 0.15;
    } else if (experience >= 5) {
        bonus = salary * 0.10;
    } else if (experience >= 2) {
        bonus = salary * 0.05;
    } else {
        bonus = salary * 0.02;
    }
    
    printf("Your bonus: $%.2f\n", bonus);
    printf("Total salary with bonus: $%.2f\n", salary + bonus);
    
    return 0;
}