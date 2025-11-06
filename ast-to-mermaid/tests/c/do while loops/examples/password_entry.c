#include <stdio.h>
#include <string.h>

int main() {
    char password[20];
    char correctPassword[] = "secret123";
    
    do {
        printf("Enter password: ");
        scanf("%s", password);
        
        if (strcmp(password, correctPassword) == 0) {
            printf("Access granted!\n");
        } else {
            printf("Incorrect password. Try again.\n");
        }
    } while (strcmp(password, correctPassword) != 0);
    
    return 0;
}