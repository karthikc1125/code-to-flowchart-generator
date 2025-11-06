#include <stdio.h>

int main() {
    long long cardNumber;
    int length = 0;
    long long temp;
    
    printf("Credit Card Type Identifier\n");
    printf("Enter credit card number: ");
    scanf("%lld", &cardNumber);
    
    // Calculate length of card number
    temp = cardNumber;
    while (temp != 0) {
        temp /= 10;
        length++;
    }
    
    if (length < 13 || length > 19) {
        printf("Invalid credit card number!\n");
    } else {
        // Get first digit
        temp = cardNumber;
        while (temp >= 10) {
            temp /= 10;
        }
        
        if (temp == 4) {
            printf("Card Type: Visa\n");
        } else if (temp == 5) {
            printf("Card Type: MasterCard\n");
        } else if (temp == 3) {
            printf("Card Type: American Express\n");
        } else if (temp == 6) {
            printf("Card Type: Discover\n");
        } else {
            printf("Card Type: Other\n");
        }
    }
    
    return 0;
}