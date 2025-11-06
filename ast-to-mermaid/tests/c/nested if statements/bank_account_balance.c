#include <stdio.h>

int main() {
    float balance = 1000.0, amount;
    int choice;
    
    printf("Current balance: $%.2f\n", balance);
    printf("1. Deposit\n2. Withdraw\nEnter your choice: ");
    scanf("%d", &choice);
    
    if (choice == 1) {
        printf("Enter amount to deposit: $");
        scanf("%f", &amount);
        if (amount > 0) {
            balance += amount;
            printf("Deposit successful!\n");
        } else {
            printf("Invalid amount!\n");
        }
    } else if (choice == 2) {
        printf("Enter amount to withdraw: $");
        scanf("%f", &amount);
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            printf("Withdrawal successful!\n");
        } else if (amount > balance) {
            printf("Insufficient funds!\n");
        } else {
            printf("Invalid amount!\n");
        }
    } else {
        printf("Invalid choice!\n");
    }
    
    printf("New balance: $%.2f\n", balance);
    
    return 0;
}