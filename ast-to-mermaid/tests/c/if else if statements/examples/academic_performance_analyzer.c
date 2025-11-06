#include <stdio.h>

int main() {
    float gpa, attendance, participation;
    int assignments, exams;
    
    printf("Academic Performance Analyzer\n");
    printf("Enter GPA (0.0-4.0): ");
    scanf("%f", &gpa);
    printf("Enter attendance percentage (0-100): ");
    scanf("%f", &attendance);
    printf("Enter participation score (0-100): ");
    scanf("%f", &participation);
    printf("Enter number of assignments completed: ");
    scanf("%d", &assignments);
    printf("Enter number of exams taken: ");
    scanf("%d", &exams);
    
    if (gpa < 0 || gpa > 4 || attendance < 0 || attendance > 100 || 
        participation < 0 || participation > 100 || assignments < 0 || exams < 0) {
        printf("Invalid input!\n");
    } else {
        printf("\n--- Performance Analysis ---\n");
        
        if (gpa >= 3.5) {
            printf("Academic standing: Excellent\n");
        } else if (gpa >= 3.0) {
            printf("Academic standing: Good\n");
        } else if (gpa >= 2.5) {
            printf("Academic standing: Satisfactory\n");
        } else if (gpa >= 2.0) {
            printf("Academic standing: Needs improvement\n");
        } else {
            printf("Academic standing: At risk\n");
        }
        
        if (attendance >= 90) {
            printf("Attendance: Outstanding\n");
        } else if (attendance >= 80) {
            printf("Attendance: Good\n");
        } else if (attendance >= 70) {
            printf("Attendance: Fair\n");
        } else {
            printf("Attendance: Poor\n");
        }
        
        if (participation >= 90) {
            printf("Participation: Excellent\n");
        } else if (participation >= 70) {
            printf("Participation: Good\n");
        } else {
            printf("Participation: Needs improvement\n");
        }
    }
    
    return 0;
}