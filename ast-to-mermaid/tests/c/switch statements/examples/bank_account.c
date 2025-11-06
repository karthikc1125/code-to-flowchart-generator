#include <stdio.h>

int main() {
    int accountType;
    float balance, amount;
    
    printf("Bank Account Operations\n");
    printf("1. Checking Account\n2. Savings Account\n3. Business Account\n");
    printf("Select account type: ");
    scanf("%d", &accountType);
    printf("Enter current balance: $");
    scanf("%f", &balance);
    
    if (balance < 0) {
        printf("Invalid balance!\n");
        return 0;
    }
    
    switch (accountType) {
        case 1:
            printf("Checking Account\n");
            printf("Minimum balance required: $100\n");
            if (balance < 100) {
                printf("Warning: Balance below minimum!\n");
            }
            break;
        case 2:
            printf("Savings Account\n");
            printf("Minimum balance required: $500\n");
            if (balance < 500) {
                printf("Warning: Balance below minimum!\n");
            }
            printf("Interest rate: 2.5%% per annum\n");
            break;
        case 3:
            printf("Business Account\n");
            printf("Minimum balance required: $5000\n");
            if (balance < 5000) {
                printf("Warning: Balance below minimum!\n");
            }
            printf("Transaction fee: $0.50 per transaction\n");
            break;
        default:
            printf("Invalid account type!\n");
    }
    
    return 0;
}