#include <stdio.h>
#include <math.h>

int main() {
    float weight, height, bmi;
    int age;
    
    printf("Health BMI Calculator\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Enter your weight (kg): ");
    scanf("%f", &weight);
    printf("Enter your height (m): ");
    scanf("%f", &height);
    
    if (age < 18) {
        printf("This calculator is designed for adults (18+ years).\n");
        return 0;
    }
    
    if (weight <= 0 || height <= 0) {
        printf("Invalid weight or height!\n");
        return 0;
    }
    
    bmi = weight / (height * height);
    
    printf("Your BMI: %.2f\n", bmi);
    
    if (bmi < 16) {
        printf("Severely underweight - Consult a doctor immediately!\n");
    } else if (bmi < 18.5) {
        printf("Underweight - Consider gaining weight.\n");
    } else if (bmi < 25) {
        printf("Normal weight - Maintain your current lifestyle.\n");
    } else if (bmi < 30) {
        printf("Overweight - Consider exercise and diet control.\n");
    } else if (bmi < 35) {
        printf("Obese Class I - Consult a nutritionist.\n");
    } else if (bmi < 40) {
        printf("Obese Class II - Medical attention recommended.\n");
    } else {
        printf("Obese Class III (Morbidly Obese) - Immediate medical attention required!\n");
    }
    
    return 0;
}