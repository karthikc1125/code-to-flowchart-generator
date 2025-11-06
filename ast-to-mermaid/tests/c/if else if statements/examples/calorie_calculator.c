#include <stdio.h>

int main() {
    int age, weight, height, activityLevel;
    char gender;
    float bmr, calories;
    
    printf("Calorie Calculator\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter your weight (kg): ");
    scanf("%d", &weight);
    printf("Enter your height (cm): ");
    scanf("%d", &height);
    printf("Enter your gender (M/F): ");
    scanf(" %c", &gender);
    printf("Activity Level:\n1. Sedentary\n2. Lightly active\n3. Moderately active\n4. Very active\n5. Extra active\nEnter choice: ");
    scanf("%d", &activityLevel);
    
    if (age < 15 || age > 100 || weight < 30 || weight > 200 || height < 100 || height > 250) {
        printf("Invalid input!\n");
    } else if (gender == 'M' || gender == 'm') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender == 'F' || gender == 'f') {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        printf("Invalid gender!\n");
        return 0;
    }
    
    if (activityLevel == 1) {
        calories = bmr * 1.2;
    } else if (activityLevel == 2) {
        calories = bmr * 1.375;
    } else if (activityLevel == 3) {
        calories = bmr * 1.55;
    } else if (activityLevel == 4) {
        calories = bmr * 1.725;
    } else if (activityLevel == 5) {
        calories = bmr * 1.9;
    } else {
        printf("Invalid activity level!\n");
        return 0;
    }
    
    printf("Your daily calorie needs: %.0f calories\n", calories);
    
    return 0;
}