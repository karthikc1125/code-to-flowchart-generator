#include <stdio.h>

int main() {
    int month, year, days;
    
    printf("Days in Month Calculator\n");
    printf("Enter month (1-12): ");
    scanf("%d", &month);
    printf("Enter year: ");
    scanf("%d", &year);
    
    if (month < 1 || month > 12) {
        printf("Invalid month!\n");
        return 0;
    }
    
    switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            days = 31;
            break;
        case 4: case 6: case 9: case 11:
            days = 30;
            break;
        case 2:
            // Check for leap year
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                days = 29;
            } else {
                days = 28;
            }
            break;
    }
    
    printf("Number of days in month %d of year %d is %d\n", month, year, days);
    
    return 0;
}