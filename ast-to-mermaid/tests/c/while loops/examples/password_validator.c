#include <stdio.h>
#include <string.h>

int main() {
    char password[100];
    int hasUpper = 0, hasLower = 0, hasDigit = 0, i = 0;
    
    printf("Enter a password (must contain at least one uppercase, lowercase, and digit): ");
    scanf("%s", password);
    
    while (password[i] != '\0') {
        if (password[i] >= 'A' && password[i] <= 'Z') {
            hasUpper = 1;
        } else if (password[i] >= 'a' && password[i] <= 'z') {
            hasLower = 1;
        } else if (password[i] >= '0' && password[i] <= '9') {
            hasDigit = 1;
        }
        i++;
    }
    
    if (hasUpper && hasLower && hasDigit) {
        printf("Password is valid.\n");
    } else {
        printf("Password is invalid. It must contain at least one uppercase letter, one lowercase letter, and one digit.\n");
    }
    
    return 0;
}