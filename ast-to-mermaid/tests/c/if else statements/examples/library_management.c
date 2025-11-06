#include <stdio.h>

int main() {
    int books, choice, days;
    float fine = 0;
    
    printf("Library Management System\n");
    printf("Enter the number of books borrowed: ");
    scanf("%d", &books);
    
    if (books <= 0) {
        printf("Invalid number of books!\n");
        return 0;
    }
    
    printf("Enter the number of days since borrowing: ");
    scanf("%d", &days);
    
    if (days < 0) {
        printf("Invalid number of days!\n");
        return 0;
    }
    
    if (days <= 7) {
        fine = 0;
        printf("No fine! Return within %d days.\n", 7 - days);
    } else if (days <= 14) {
        fine = books * (days - 7) * 0.5;
        printf("Fine: $%.2f\n", fine);
    } else if (days <= 30) {
        fine = books * (7 * 0.5 + (days - 14) * 1);
        printf("Fine: $%.2f\n", fine);
    } else {
        fine = books * (7 * 0.5 + 16 * 1 + (days - 30) * 2);
        printf("Fine: $%.2f\n", fine);
        printf("Membership may be cancelled!\n");
    }
    
    return 0;
}