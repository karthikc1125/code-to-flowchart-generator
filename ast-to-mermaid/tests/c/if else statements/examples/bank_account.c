#include <stdio.h>

int main() {
    double balance = 1000.0;
    double withdrawal = 1500.0;
    
    if (withdrawal <= balance) {
        balance -= withdrawal;
        printf("Withdrawal successful. New balance: $%.2f\n", balance);
    } else {
        printf("Insufficient funds. Current balance: $%.2f\n", balance);
        printf("Withdrawal amount: $%.2f\n", withdrawal);
    }
    
    return 0;
}