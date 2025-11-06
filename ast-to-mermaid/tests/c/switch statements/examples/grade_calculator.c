#include <stdio.h>

int main() {
    int marks;
    char grade;
    
    printf("Grade Calculator\n");
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
            printf("Grade: %c (Excellent)\n", grade);
            break;
        case 8:
            grade = 'B';
            printf("Grade: %c (Good)\n", grade);
            break;
        case 7:
            grade = 'C';
            printf("Grade: %c (Average)\n", grade);
            break;
        case 6:
            grade = 'D';
            printf("Grade: %c (Below Average)\n", grade);
            break;
        default:
            grade = 'F';
            printf("Grade: %c (Fail)\n", grade);
    }
    
    return 0;
}