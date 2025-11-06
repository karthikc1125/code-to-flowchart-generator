#include <stdio.h>

int main() {
    int day;
    
    printf("Weekday or Weekend Checker\n");
    printf("Enter day number (1-7): ");
    scanf("%d", &day);
    
    switch (day) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            printf("It's a weekday\n");
            break;
        case 6:
        case 7:
            printf("It's a weekend\n");
            break;
        default:
            printf("Invalid day number!\n");
    }
    
    return 0;
}