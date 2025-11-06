#include <stdio.h>

int main() {
    int age;
    
    printf("Enter your age: ");
    scanf("%d", &age);
    
    if (age >= 18) {
        printf("You are eligible to vote.\n");
        
        if (age >= 65) {
            printf("You are also eligible for senior citizen benefits.\n");
        }
    } else {
        printf("You are not eligible to vote yet.\n");
        
        int years_left = 18 - age;
        printf("You need to wait %d more years to vote.\n", years_left);
    }
    
    return 0;
}