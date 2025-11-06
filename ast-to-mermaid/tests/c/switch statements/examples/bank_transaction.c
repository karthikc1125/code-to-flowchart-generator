#include <stdio.h>

int main() {
    int choice;
    float balance = 1000.00, amount;
    
    printf("Bank Transaction System\n");
    printf("Current balance: $%.2f\n", balance);
    printf("1. Deposit\n2. Withdraw\n3. Check Balance\n4. Exit\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    
    switch (choice) {
        case 1:
            printf("Enter amount to deposit: $");
            scanf("%f", &amount);
            if (amount > 0) {
                balance += amount;
                printf("Deposit successful!\n");
                printf("New balance: $%.2f\n", balance);
            } else {
                printf("Invalid amount!\n");
            }
            break;
        case 2:
            printf("Enter amount to withdraw: $");
            scanf("%f", &amount);
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                printf("Withdrawal successful!\n");
                printf("New balance: $%.2f\n", balance);
            } else if (amount > balance) {
                printf("Insufficient funds!\n");
            } else {
                printf("Invalid amount!\n");
            }
            break;
        case 3:
            printf("Current balance: $%.2f\n", balance);
            break;
        case 4:
            printf("Thank you for banking with us!\n");
            break;
        default:
            printf("Invalid choice! Please try again.\n");
    }
    
    return 0;
}