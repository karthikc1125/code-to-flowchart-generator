#include <stdio.h>

int main() {
    float balance = 1000.0;
    int choice;
    float amount;
    
    do {
        printf("\nBank Account Menu:\n");
        printf("1. Check Balance\n");
        printf("2. Deposit\n");
        printf("3. Withdraw\n");
        printf("4. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        
        switch (choice) {
            case 1:
                printf("Your balance is $%.2f\n", balance);
                break;
            case 2:
                printf("Enter amount to deposit: ");
                scanf("%f", &amount);
                if (amount > 0) {
                    balance += amount;
                    printf("Deposit successful. New balance: $%.2f\n", balance);
                } else {
                    printf("Invalid amount.\n");
                }
                break;
            case 3:
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
            case 4:
                printf("Thank you for using our bank!\n");
                break;
            default:
                printf("Invalid choice. Please try again.\n");
        }
    } while (choice != 4);
    
    return 0;
}