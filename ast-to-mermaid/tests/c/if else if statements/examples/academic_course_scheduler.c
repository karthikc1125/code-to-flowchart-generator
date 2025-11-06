#include <stdio.h>

int main() {
    int courseDifficulty, studyHours, examDifficulty, assignmentLoad, projectCount;
    int stressLevel, successProbability;
    
    printf("Academic Course Scheduler\n");
    printf("Rate course difficulty (1-10): ");
    scanf("%d", &courseDifficulty);
    printf("Available study hours per week: ");
    scanf("%d", &studyHours);
    printf("Rate exam difficulty (1-10): ");
    scanf("%d", &examDifficulty);
    printf("Rate assignment load (1-10): ");
    scanf("%d", &assignmentLoad);
    printf("Number of major projects: ");
    scanf("%d", &projectCount);
    
    if (courseDifficulty < 1 || courseDifficulty > 10 || studyHours < 0 ||
        examDifficulty < 1 || examDifficulty > 10 || assignmentLoad < 1 || 
        assignmentLoad > 10 || projectCount < 0) {
        printf("Invalid input!\n");
    } else {
        // Calculate stress level (1-10)
        stressLevel = (courseDifficulty + examDifficulty + assignmentLoad + projectCount) / 4;
        
        // Calculate success probability (1-100%)
        successProbability = 100 - (stressLevel * 5) + (studyHours * 2);
        
        if (successProbability > 100) successProbability = 100;
        if (successProbability < 0) successProbability = 0;
        
        printf("\n--- Course Analysis ---\n");
        printf("Estimated stress level: %d/10\n", stressLevel);
        printf("Success probability: %d%%\n", successProbability);
        
        if (stressLevel >= 8) {
            printf("Warning: Very high stress level\n");
        } else if (stressLevel >= 6) {
            printf("Note: Moderate to high stress level\n");
        } else if (stressLevel >= 4) {
            printf("Note: Moderate stress level\n");
        } else {
            printf("Note: Low stress level\n");
        }
        
        if (successProbability >= 80) {
            printf("Recommendation: Good chance of success\n");
        } else if (successProbability >= 60) {
            printf("Recommendation: Reasonable chance with effort\n");
        } else if (successProbability >= 40) {
            printf("Recommendation: Challenging but possible\n");
        } else {
            printf("Recommendation: Consider alternatives\n");
        }
        
        // Study hour recommendations
        int recommendedHours = (courseDifficulty + examDifficulty + assignmentLoad) * 2;
        if (studyHours < recommendedHours) {
            printf("Suggestion: Increase study time to %d hours/week\n", recommendedHours);
        }
    }
    
    return 0;
}