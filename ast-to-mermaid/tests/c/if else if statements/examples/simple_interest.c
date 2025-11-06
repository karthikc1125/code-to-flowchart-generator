#include <stdio.h>

int main() {
    float principal, rate, time, simpleInterest;
    
    printf("Enter principal amount: ");
    scanf("%f", &principal);
    
    printf("Enter rate of interest: ");
    scanf("%f", &rate);
    
    printf("Enter time period (in years): ");
    scanf("%f", &time);
    
    if (principal <= 0) {
        printf("Invalid principal amount\n");
    } else if (rate <= 0) {
        printf("Invalid rate of interest\n");
    } else if (time <= 0) {
        printf("Invalid time period\n");
    } else {
        simpleInterest = (principal * rate * time) / 100;
        printf("Simple Interest = %.2f\n", simpleInterest);
    }
    
    return 0;
}