#include <stdio.h>

int main() {
    int age, category;
    
    printf("Age Category Classifier\n");
    printf("Enter your age: ");
    scanf("%d", &age);
    
    if (age < 0) {
        printf("Invalid age!\n");
        return 0;
    }
    
    if (age <= 12) {
        category = 1;
    } else if (age <= 19) {
        category = 2;
    } else if (age <= 59) {
        category = 3;
    } else {
        category = 4;
    }
    
    switch (category) {
        case 1:
            printf("Child\n");
            break;
        case 2:
            printf("Teenager\n");
            break;
        case 3:
            printf("Adult\n");
            break;
        case 4:
            printf("Senior Citizen\n");
            break;
    }
    
    return 0;
}