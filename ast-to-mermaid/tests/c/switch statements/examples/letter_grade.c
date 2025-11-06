#include <stdio.h>

int main() {
    int marks;
    
    printf("Letter Grade Converter\n");
    printf("Enter marks (0-100): ");
    scanf("%d", &marks);
    
    if (marks < 0 || marks > 100) {
        printf("Invalid marks!\n");
        return 0;
    }
    
    switch (marks / 10) {
        case 10:
        case 9:
            printf("Marks: %d - Grade: A+\n", marks);
            break;
        case 8:
            printf("Marks: %d - Grade: A\n", marks);
            break;
        case 7:
            printf("Marks: %d - Grade: B\n", marks);
            break;
        case 6:
            printf("Marks: %d - Grade: C\n", marks);
            break;
        case 5:
            printf("Marks: %d - Grade: D\n", marks);
            break;
        case 4:
            printf("Marks: %d - Grade: E\n", marks);
            break;
        default:
            printf("Marks: %d - Grade: F (Fail)\n", marks);
    }
    
    return 0;
}