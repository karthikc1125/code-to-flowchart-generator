#include <stdio.h>
#include <string.h>

int main() {
    char password[100];
    int length, hasUpper = 0, hasLower = 0, hasDigit = 0, hasSpecial = 0;
    
    printf("Enter a password: ");
    scanf("%s", password);
    
    length = strlen(password);
    
    for (int i = 0; i < length; i++) {
        if (password[i] >= 'A' && password[i] <= 'Z') {
            hasUpper = 1;
        } else if (password[i] >= 'a' && password[i] <= 'z') {
            hasLower = 1;
        } else if (password[i] >= '0' && password[i] <= '9') {
            hasDigit = 1;
        } else {
            hasSpecial = 1;
        }
    }
    
    if (length < 6) {
        printf("Password strength: Weak (too short)\n");
    } else if (hasUpper && hasLower && hasDigit && hasSpecial) {
        printf("Password strength: Strong\n");
    } else if ((hasUpper || hasLower) && hasDigit) {
        printf("Password strength: Medium\n");
    } else {
        printf("Password strength: Weak\n");
    }
    
    return 0;
}