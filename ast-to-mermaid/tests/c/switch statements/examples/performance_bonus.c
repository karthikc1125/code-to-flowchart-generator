#include <stdio.h>

int main() {
    int department, rating;
    float salary, bonus;
    
    printf("Performance Bonus Calculator\n");
    printf("1. Sales\n2. Engineering\n3. Marketing\n4. HR\n");
    printf("Select department: ");
    scanf("%d", &department);
    printf("Enter salary: $");
    scanf("%f", &salary);
    printf("Enter performance rating (1-5): ");
    scanf("%d", &rating);
    
    if (salary <= 0 || rating < 1 || rating > 5) {
        printf("Invalid input!\n");
        return 0;
    }
    
    switch (department) {
        case 1:
            switch (rating) {
                case 5: bonus = salary * 0.20; break;
                case 4: bonus = salary * 0.15; break;
                case 3: bonus = salary * 0.10; break;
                case 2: bonus = salary * 0.05; break;
                case 1: bonus = salary * 0.02; break;
            }
            printf("Sales department bonus: $%.2f\n", bonus);
            break;
        case 2:
            switch (rating) {
                case 5: bonus = salary * 0.18; break;
                case 4: bonus = salary * 0.13; break;
                case 3: bonus = salary * 0.08; break;
                case 2: bonus = salary * 0.04; break;
                case 1: bonus = salary * 0.01; break;
            }
            printf("Engineering department bonus: $%.2f\n", bonus);
            break;
        case 3:
            switch (rating) {
                case 5: bonus = salary * 0.16; break;
                case 4: bonus = salary * 0.11; break;
                case 3: bonus = salary * 0.06; break;
                case 2: bonus = salary * 0.03; break;
                case 1: bonus = salary * 0.01; break;
            }
            printf("Marketing department bonus: $%.2f\n", bonus);
            break;
        case 4:
            switch (rating) {
                case 5: bonus = salary * 0.14; break;
                case 4: bonus = salary * 0.09; break;
                case 3: bonus = salary * 0.05; break;
                case 2: bonus = salary * 0.02; break;
                case 1: bonus = salary * 0.01; break;
            }
            printf("HR department bonus: $%.2f\n", bonus);
            break;
        default:
            printf("Invalid department!\n");
    }
    
    return 0;
}