#include <stdio.h>

int main() {
    int age, weight, height, activityLevel;
    char goal;
    float bmr, calories;
    
    printf("Diet Plan Recommender\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter your weight (kg): ");
    scanf("%d", &weight);
    printf("Enter your height (cm): ");
    scanf("%d", &height);
    printf("Enter activity level (1-sedentary, 2-light, 3-moderate, 4-active): ");
    scanf("%d", &activityLevel);
    printf("Goal (L-lose weight, G-gain weight, M-maintain): ");
    scanf(" %c", &goal);
    
    if (age < 15 || age > 100 || weight < 30 || weight > 200 || 
        height < 100 || height > 250 || activityLevel < 1 || activityLevel > 4) {
        printf("Invalid input!\n");
    } else {
        // Calculate BMR using Mifflin-St Jeor Equation
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        
        // Adjust for activity level
        if (activityLevel == 1) {
            calories = bmr * 1.2;
        } else if (activityLevel == 2) {
            calories = bmr * 1.375;
        } else if (activityLevel == 3) {
            calories = bmr * 1.55;
        } else {
            calories = bmr * 1.725;
        }
        
        printf("\n--- Diet Recommendation ---\n");
        printf("Maintenance calories: %.0f calories/day\n", calories);
        
        if (goal == 'L' || goal == 'l') {
            printf("Weight loss plan: %.0f calories/day\n", calories - 500);
            printf("Recommended: High protein, moderate carbs, low fat\n");
        } else if (goal == 'G' || goal == 'g') {
            printf("Weight gain plan: %.0f calories/day\n", calories + 500);
            printf("Recommended: High protein, high carbs, moderate fat\n");
        } else {
            printf("Maintenance plan: %.0f calories/day\n", calories);
            printf("Recommended: Balanced macronutrients\n");
        }
    }
    
    return 0;
}