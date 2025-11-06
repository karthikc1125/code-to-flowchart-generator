#include <stdio.h>

int main() {
    int marks;
    char grade;
    int continueCalc;
    
    do {
        printf("Enter student marks (0-100): ");
        scanf("%d", &marks);
        
        if (marks >= 90) {
            grade = 'A';
        } else if (marks >= 80) {
            grade = 'B';
        } else if (marks >= 70) {
            grade = 'C';
        } else if (marks >= 60) {
            grade = 'D';
        } else {
            grade = 'F';
        }
        
        printf("Grade: %c\n", grade);
        
        printf("Do you want to calculate another grade? (1 for yes, 0 for no): ");
        scanf("%d", &continueCalc);
    } while (continueCalc == 1);
    
    return 0;
}