#include <stdio.h>

int main() {
    float number;
    
    printf("Enter a number: ");
    scanf("%f", &number);
    
    if (number > 0) {
        printf("%.2f is positive\n", number);
    } else if (number < 0) {
        printf("%.2f is negative\n", number);
    } else {
        printf("The number is zero\n");
    }
    
    return 0;
}