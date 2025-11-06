#include <stdio.h>
#include <string.h>

int main() {
    char password[100];
    int length;
    
    printf("Enter a password: ");
    scanf("%s", password);
    
    length = strlen(password);
    
    if (length < 6) {
        printf("Password is too weak\n");
    } else if (length < 10) {
        printf("Password is moderate\n");
    } else {
        printf("Password is strong\n");
    }
    
    return 0;
}