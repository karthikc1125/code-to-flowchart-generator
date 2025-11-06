#include <stdio.h>

int main() {
    float salary = 5000.0;
    int years_of_service = 7;
    float bonus;
    
    if (years_of_service < 1) {
        bonus = 0;
    } else if (years_of_service < 3) {
        bonus = salary * 0.05;
    } else if (years_of_service < 5) {
        bonus = salary * 0.10;
    } else if (years_of_service < 10) {
        bonus = salary * 0.15;
    } else {
        bonus = salary * 0.20;
    }
    
    printf("Employee with salary $%.2f and %d years of service gets bonus: $%.2f\n", 
           salary, years_of_service, bonus);
    
    return 0;
}