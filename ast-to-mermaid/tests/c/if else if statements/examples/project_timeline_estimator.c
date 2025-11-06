#include <stdio.h>

int main() {
    int tasks, complexity, resources, experience;
    int estimatedDays;
    
    printf("Project Timeline Estimator\n");
    printf("Enter number of tasks: ");
    scanf("%d", &tasks);
    printf("Enter complexity level (1-low, 2-medium, 3-high): ");
    scanf("%d", &complexity);
    printf("Enter number of resources (people): ");
    scanf("%d", &resources);
    printf("Enter team experience level (1-beginner, 2-intermediate, 3-expert): ");
    scanf("%d", &experience);
    
    if (tasks <= 0 || complexity < 1 || complexity > 3 || 
        resources <= 0 || experience < 1 || experience > 3) {
        printf("Invalid input!\n");
    } else {
        // Base estimate
        estimatedDays = tasks * 2;
        
        // Adjust for complexity
        if (complexity == 2) {
            estimatedDays = estimatedDays * 1.5;
        } else if (complexity == 3) {
            estimatedDays = estimatedDays * 2;
        }
        
        // Adjust for resources
        if (resources > 5) {
            estimatedDays = estimatedDays * 0.8; // More resources, less time
        } else if (resources < 3) {
            estimatedDays = estimatedDays * 1.3; // Fewer resources, more time
        }
        
        // Adjust for experience
        if (experience == 2) {
            estimatedDays = estimatedDays * 0.9;
        } else if (experience == 3) {
            estimatedDays = estimatedDays * 0.7;
        } else {
            estimatedDays = estimatedDays * 1.2;
        }
        
        printf("\n--- Project Estimate ---\n");
        printf("Estimated project duration: %d days\n", estimatedDays);
        
        if (estimatedDays > 120) {
            printf("Risk: High - Consider breaking into phases\n");
        } else if (estimatedDays > 60) {
            printf("Risk: Medium - Monitor progress closely\n");
        } else {
            printf("Risk: Low - Manageable timeline\n");
        }
    }
    
    return 0;
}