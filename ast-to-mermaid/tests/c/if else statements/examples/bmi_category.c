#include <stdio.h>

int main() {
    float weight, height, bmi;
    
    printf("Enter your weight (kg): ");
    scanf("%f", &weight);
    printf("Enter your height (m): ");
    scanf("%f", &height);
    
    bmi = weight / (height * height);
    
    if (bmi < 0) {
        printf("Invalid BMI!\n");
    } else if (bmi < 18.5) {
        printf("Your BMI is %.2f - Underweight\n", bmi);
    } else if (bmi < 25) {
        printf("Your BMI is %.2f - Normal weight\n", bmi);
    } else if (bmi < 30) {
        printf("Your BMI is %.2f - Overweight\n", bmi);
    } else {
        printf("Your BMI is %.2f - Obese\n", bmi);
    }
    
    return 0;
}