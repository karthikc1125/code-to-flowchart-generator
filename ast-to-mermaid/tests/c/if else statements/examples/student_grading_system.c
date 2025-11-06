#include <stdio.h>

int main() {
    int subjects, totalMarks = 0;
    float average, percentage;
    char grade;
    
    printf("Enter the number of subjects: ");
    scanf("%d", &subjects);
    
    if (subjects <= 0) {
        printf("Invalid number of subjects!\n");
        return 0;
    }
    
    int marks[subjects];
    
    printf("Enter marks for %d subjects:\n", subjects);
    for (int i = 0; i < subjects; i++) {
        printf("Subject %d: ", i + 1);
        scanf("%d", &marks[i]);
        
        if (marks[i] < 0 || marks[i] > 100) {
            printf("Invalid marks! Marks should be between 0 and 100.\n");
            return 0;
        }
        
        totalMarks += marks[i];
    }
    
    average = (float)totalMarks / subjects;
    percentage = average;
    
    if (percentage >= 90) {
        grade = 'A';
    } else if (percentage >= 80) {
        grade = 'B';
    } else if (percentage >= 70) {
        grade = 'C';
    } else if (percentage >= 60) {
        grade = 'D';
    } else if (percentage >= 50) {
        grade = 'E';
    } else {
        grade = 'F';
    }
    
    printf("\n--- Student Report ---\n");
    printf("Total Marks: %d\n", totalMarks);
    printf("Average Marks: %.2f\n", average);
    printf("Percentage: %.2f%%\n", percentage);
    printf("Grade: %c\n", grade);
    
    if (grade == 'F') {
        printf("Result: Fail\n");
    } else {
        printf("Result: Pass\n");
    }
    
    return 0;
}