#include <stdio.h>

int main() {
    char letterGrade;
    float gpa;
    
    printf("Grade Converter (Letter to GPA)\n");
    printf("Enter letter grade (A, B, C, D, F): ");
    scanf(" %c", &letterGrade);
    
    switch (letterGrade) {
        case 'A':
        case 'a':
            gpa = 4.0;
            printf("GPA: %.1f\n", gpa);
            break;
        case 'B':
        case 'b':
            gpa = 3.0;
            printf("GPA: %.1f\n", gpa);
            break;
        case 'C':
        case 'c':
            gpa = 2.0;
            printf("GPA: %.1f\n", gpa);
            break;
        case 'D':
        case 'd':
            gpa = 1.0;
            printf("GPA: %.1f\n", gpa);
            break;
        case 'F':
        case 'f':
            gpa = 0.0;
            printf("GPA: %.1f\n", gpa);
            break;
        default:
            printf("Error: Invalid letter grade!\n");
    }
    
    return 0;
}