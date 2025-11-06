#include <stdio.h>

int main() {
    char ch;
    int category;
    
    printf("Character Classifier\n");
    printf("Enter a character: ");
    scanf(" %c", &ch);
    
    if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) {
        category = 1;
    } else if (ch >= '0' && ch <= '9') {
        category = 2;
    } else if (ch == ' ' || ch == '\t' || ch == '\n') {
        category = 3;
    } else {
        category = 4;
    }
    
    switch (category) {
        case 1:
            printf("'%c' is a letter\n", ch);
            break;
        case 2:
            printf("'%c' is a digit\n", ch);
            break;
        case 3:
            printf("'%c' is a whitespace character\n", ch);
            break;
        case 4:
            printf("'%c' is a special symbol\n", ch);
            break;
    }
    
    return 0;
}