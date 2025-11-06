#include <stdio.h>

int main() {
    int marks;
    char grade;
    
    printf("Enter your marks (0-100): ");
    scanf("%d", &marks);
    
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
        case 4:
        case 3:
        case 2:
        case 1:
        case 0:
            grade = 'F';
            break;
        default:
            printf("Invalid marks. Please enter marks between 0 and 100.\n");
            return 1;
    }
    
    printf("Your grade is: %c\n", grade);
    
    return 0;
}