#include <stdio.h>
#include <string.h>

int main() {
    char password[] = "Secret123";
    int length = strlen(password);
    
    if (length >= 8) {
        int has_upper = 0, has_lower = 0, has_digit = 0;
        
        for (int i = 0; i < length; i++) {
            if (password[i] >= 'A' && password[i] <= 'Z') {
                has_upper = 1;
            } else if (password[i] >= 'a' && password[i] <= 'z') {
                has_lower = 1;
            } else if (password[i] >= '0' && password[i] <= '9') {
                has_digit = 1;
            }
        }
        
        if (has_upper && has_lower && has_digit) {
            printf("Password is strong.\n");
        } else {
            printf("Password should contain uppercase, lowercase, and digit.\n");
        }
    } else {
        printf("Password should be at least 8 characters long.\n");
    }
    
    return 0;
}