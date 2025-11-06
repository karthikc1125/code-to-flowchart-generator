#include <stdio.h>

int main() {
    int month;
    
    printf("Season Finder\n");
    printf("Enter month number (1-12): ");
    scanf("%d", &month);
    
    switch (month) {
        case 12:
        case 1:
        case 2:
            printf("Season: Winter\n");
            break;
        case 3:
        case 4:
        case 5:
            printf("Season: Spring\n");
            break;
        case 6:
        case 7:
        case 8:
            printf("Season: Summer\n");
            break;
        case 9:
        case 10:
        case 11:
            printf("Season: Autumn/Fall\n");
            break;
        default:
            printf("Invalid month number!\n");
    }
    
    return 0;
}