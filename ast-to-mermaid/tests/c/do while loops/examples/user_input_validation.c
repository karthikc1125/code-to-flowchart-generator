#include <stdio.h>

int main() {
    int age;
    
    do {
        printf("Enter your age (1-120): ");
        scanf("%d", &age);
        
        if (age < 1 || age > 120) {
            printf("Invalid age. Please enter a value between 1 and 120.\n");
        }
    } while (age < 1 || age > 120);
    
    printf("Valid age entered: %d\n", age);
    
    return 0;
}