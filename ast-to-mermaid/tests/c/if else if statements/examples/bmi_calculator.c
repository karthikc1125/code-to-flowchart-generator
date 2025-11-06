#include <stdio.h>

int main() {
    float weight, height, bmi;
    
    printf("Enter weight (kg): ");
    scanf("%f", &weight);
    
    printf("Enter height (m): ");
    scanf("%f", &height);
    
    bmi = weight / (height * height);
    
    if (bmi < 18.5) {
        printf("BMI: %.2f - Underweight\n", bmi);
    } else if (bmi < 25) {
        printf("BMI: %.2f - Normal weight\n", bmi);
    } else if (bmi < 30) {
        printf("BMI: %.2f - Overweight\n", bmi);
    } else {
        printf("BMI: %.2f - Obese\n", bmi);
    }
    
    return 0;
}