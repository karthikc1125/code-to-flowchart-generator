#include <stdio.h>

int main() {
    int marks;
    char grade;
    
    printf("Exam Grade Calculator\n");
    printf("Enter marks (0-100): ");
    scanf("%d", &marks);
    
    if (marks < 0 || marks > 100) {
        printf("Invalid marks!\n");
        return 0;
    }
    
    switch (marks / 10) {
        case 10:
        case 9:
            grade = 'A';
            break;
        case 8:
            grade = 'B';
            break;
        case 7:
            grade = 'C';
            break;
        case 6:
            grade = 'D';
            break;
        case 5:
            grade = 'E';
            break;
        default:
            grade = 'F';
    }
    
    switch (grade) {
        case 'A':
            printf("Grade: %c - Excellent\n", grade);
            break;
        case 'B':
            printf("Grade: %c - Good\n", grade);
            break;
        case 'C':
            printf("Grade: %c - Average\n", grade);
            break;
        case 'D':
            printf("Grade: %c - Below Average\n", grade);
            break;
        case 'E':
            printf("Grade: %c - Pass\n", grade);
            break;
        case 'F':
            printf("Grade: %c - Fail\n", grade);
            break;
    }
    
    return 0;
}