#include <stdio.h>

int main() {
    char ch;
    int type;
    
    printf("Character Type Identifier\n");
    printf("Enter a character: ");
    scanf(" %c", &ch);
    
    if (ch >= 'A' && ch <= 'Z') {
        type = 1;
    } else if (ch >= 'a' && ch <= 'z') {
        type = 2;
    } else if (ch >= '0' && ch <= '9') {
        type = 3;
    } else {
        type = 4;
    }
    
    switch (type) {
        case 1:
            printf("'%c' is an uppercase letter\n", ch);
            break;
        case 2:
            printf("'%c' is a lowercase letter\n", ch);
            break;
        case 3:
            printf("'%c' is a digit\n", ch);
            break;
        case 4:
            printf("'%c' is a special character\n", ch);
            break;
    }
    
    return 0;
}