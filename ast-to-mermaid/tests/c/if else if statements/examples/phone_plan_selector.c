#include <stdio.h>

int main() {
    int data, calls, texts;
    float price = 0;
    
    printf("Phone Plan Selector\n");
    printf("Enter monthly data usage (GB): ");
    scanf("%d", &data);
    printf("Enter monthly call minutes: ");
    scanf("%d", &calls);
    printf("Enter monthly text messages: ");
    scanf("%d", &texts);
    
    if (data < 0 || calls < 0 || texts < 0) {
        printf("Invalid input!\n");
    } else if (data <= 2 && calls <= 200 && texts <= 100) {
        price = 25.00; // Basic plan
        printf("Recommended Plan: Basic ($%.2f/month)\n", price);
        printf("Includes: 2GB data, 200 minutes, 100 texts\n");
    } else if (data <= 5 && calls <= 500 && texts <= 500) {
        price = 40.00; // Standard plan
        printf("Recommended Plan: Standard ($%.2f/month)\n", price);
        printf("Includes: 5GB data, 500 minutes, 500 texts\n");
    } else if (data <= 10 && calls <= 1000 && texts <= 1000) {
        price = 60.00; // Premium plan
        printf("Recommended Plan: Premium ($%.2f/month)\n", price);
        printf("Includes: 10GB data, 1000 minutes, 1000 texts\n");
    } else if (data <= 20 && calls <= 2000 && texts <= 2000) {
        price = 80.00; // Unlimited plan
        printf("Recommended Plan: Unlimited ($%.2f/month)\n", price);
        printf("Includes: 20GB data, 2000 minutes, 2000 texts\n");
    } else {
        price = 100.00; // Family plan
        printf("Recommended Plan: Family ($%.2f/month)\n", price);
        printf("Includes: Unlimited everything\n");
    }
    
    return 0;
}