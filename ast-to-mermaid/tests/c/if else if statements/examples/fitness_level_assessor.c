#include <stdio.h>

int main() {
    int age, weight, height, exerciseDays, restingHR;
    float bmi;
    
    printf("Fitness Level Assessor\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter your weight (kg): ");
    scanf("%d", &weight);
    printf("Enter your height (cm): ");
    scanf("%d", &height);
    printf("Enter days of exercise per week: ");
    scanf("%d", &exerciseDays);
    printf("Enter resting heart rate (bpm): ");
    scanf("%d", &restingHR);
    
    if (age < 10 || age > 100 || weight < 30 || weight > 200 || 
        height < 100 || height > 250 || exerciseDays < 0 || exerciseDays > 7 || 
        restingHR < 40 || restingHR > 120) {
        printf("Invalid input!\n");
    } else {
        bmi = weight / ((height/100.0) * (height/100.0));
        
        if (bmi < 18.5) {
            printf("BMI Category: Underweight\n");
        } else if (bmi < 25) {
            printf("BMI Category: Normal weight\n");
        } else if (bmi < 30) {
            printf("BMI Category: Overweight\n");
        } else {
            printf("BMI Category: Obese\n");
        }
        
        if (exerciseDays >= 5 && restingHR < 60) {
            printf("Fitness Level: Excellent\n");
        } else if (exerciseDays >= 3 && restingHR < 70) {
            printf("Fitness Level: Good\n");
        } else if (exerciseDays >= 1 && restingHR < 80) {
            printf("Fitness Level: Fair\n");
        } else {
            printf("Fitness Level: Poor\n");
        }
    }
    
    return 0;
}