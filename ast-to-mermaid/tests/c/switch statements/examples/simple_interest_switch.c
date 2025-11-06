#include <stdio.h>

int main() {
    int choice;
    float principal, rate, time, simpleInterest;
    
    printf("Simple Interest Calculator:\n");
    printf("1. Calculate Simple Interest\n");
    printf("2. Calculate Principal\n");
    printf("3. Calculate Rate\n");
    printf("4. Calculate Time\n");
    printf("Enter your choice (1-4): ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("Enter principal amount: ");
            scanf("%f", &principal);
            printf("Enter rate of interest: ");
            scanf("%f", &rate);
            printf("Enter time period (in years): ");
            scanf("%f", &time);
            simpleInterest = (principal * rate * time) / 100;
            printf("Simple Interest = %.2f\n", simpleInterest);
            break;
        case 2:
            printf("Enter simple interest: ");
            scanf("%f", &simpleInterest);
            printf("Enter rate of interest: ");
            scanf("%f", &rate);
            printf("Enter time period (in years): ");
            scanf("%f", &time);
            principal = (simpleInterest * 100) / (rate * time);
            printf("Principal Amount = %.2f\n", principal);
            break;
        case 3:
            printf("Enter simple interest: ");
            scanf("%f", &simpleInterest);
            printf("Enter principal amount: ");
            scanf("%f", &principal);
            printf("Enter time period (in years): ");
            scanf("%f", &time);
            rate = (simpleInterest * 100) / (principal * time);
            printf("Rate of Interest = %.2f%%\n", rate);
            break;
        case 4:
            printf("Enter simple interest: ");
            scanf("%f", &simpleInterest);
            printf("Enter principal amount: ");
            scanf("%f", &principal);
            printf("Enter rate of interest: ");
            scanf("%f", &rate);
            time = (simpleInterest * 100) / (principal * rate);
            printf("Time Period = %.2f years\n", time);
            break;
        default:
            printf("Invalid choice. Please select a valid option (1-4).\n");
    }
    
    return 0;
}