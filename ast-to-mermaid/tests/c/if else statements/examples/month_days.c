#include <stdio.h>

int main() {
    int month, year, days;
    
    printf("Enter month (1-12): ");
    scanf("%d", &month);
    printf("Enter year: ");
    scanf("%d", &year);
    
    if (month < 1 || month > 12) {
        printf("Invalid month!\n");
    } else if (month == 2) {
        // Check for leap year
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            days = 29;
        } else {
            days = 28;
        }
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        days = 30;
    } else {
        days = 31;
    }
    
    if (month >= 1 && month <= 12) {
        printf("Number of days in month %d of year %d is %d\n", month, year, days);
    }
    
    return 0;
}