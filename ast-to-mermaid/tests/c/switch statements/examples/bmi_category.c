#include <stdio.h>

int main() {
    float weight, height, bmi;
    int category;
    
    printf("BMI Category Classifier\n");
    printf("Enter weight (kg): ");
    scanf("%f", &weight);
    printf("Enter height (m): ");
    scanf("%f", &height);
    
    if (weight <= 0 || height <= 0) {
        printf("Invalid input!\n");
        return 0;
    }
    
    bmi = weight / (height * height);
    
    if (bmi < 18.5) {
        category = 1;
    } else if (bmi < 25) {
        category = 2;
    } else if (bmi < 30) {
        category = 3;
    } else {
        category = 4;
    }
    
    switch (category) {
        case 1:
            printf("Underweight (BMI: %.2f)\n", bmi);
            break;
        case 2:
            printf("Normal weight (BMI: %.2f)\n", bmi);
            break;
        case 3:
            printf("Overweight (BMI: %.2f)\n", bmi);
            break;
        case 4:
            printf("Obese (BMI: %.2f)\n", bmi);
            break;
    }
    
    return 0;
}