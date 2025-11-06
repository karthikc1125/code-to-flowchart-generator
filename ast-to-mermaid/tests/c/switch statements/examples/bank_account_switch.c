#include <stdio.h>

int main() {
    int choice;
    float balance = 1000.00;
    float amount;
    
    printf("Bank Account System\n");
    printf("Current Balance: $%.2f\n", balance);
    printf("\n1. Deposit\n");
    printf("2. Withdraw\n");
    printf("3. Check Balance\n");
    printf("4. Exit\n");
    printf("Enter your choice (1-4): ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("Enter amount to deposit: ");
            scanf("%f", &amount);
            if (amount > 0) {
                balance += amount;
                printf("Deposit successful. New balance: $%.2f\n", balance);
            } else {
                printf("Invalid amount.\n");
            }
            break;
        case 2:
            printf("Enter amount to withdraw: ");
            scanf("%f", &amount);
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                printf("Withdrawal successful. New balance: $%.2f\n", balance);
            } else if (amount > balance) {
                printf("Insufficient funds.\n");
            } else {
                printf("Invalid amount.\n");
            }
            break;
        case 3:
            printf("Your current balance is: $%.2f\n", balance);
            break;
        case 4:
            printf("Thank you for using our banking system!\n");
            break;
        default:
            printf("Invalid choice. Please select a valid option (1-4).\n");
    }
    
    return 0;
}