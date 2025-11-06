#include <stdio.h>

int main() {
    int age;
    
    printf("Enter your age: ");
    scanf("%d", &age);
    
    if (age < 0) {
        printf("Invalid age\n");
    } else if (age <= 12) {
        printf("Child\n");
    } else if (age <= 19) {
        printf("Teenager\n");
    } else if (age <= 59) {
        printf("Adult\n");
    } else {
        printf("Senior Citizen\n");
    }
    
    return 0;
}