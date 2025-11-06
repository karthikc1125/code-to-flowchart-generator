#include <stdio.h>

int main() {
    float principal, rate, time, simpleInterest;
    int i = 1, years;
    
    printf("Enter principal amount: ");
    scanf("%f", &principal);
    
    printf("Enter rate of interest: ");
    scanf("%f", &rate);
    
    printf("Enter number of years: ");
    scanf("%d", &years);
    
    printf("\nYear\tSimple Interest\tAmount\n");
    while (i <= years) {
        simpleInterest = (principal * rate * i) / 100;
        printf("%d\t%.2f\t\t%.2f\n", i, simpleInterest, principal + simpleInterest);
        i++;
    }
    
    return 0;
}