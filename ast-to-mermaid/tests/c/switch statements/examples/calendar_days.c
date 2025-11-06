#include <stdio.h>

int main() {
    int month, year;
    
    printf("Calendar Days Calculator\n");
    printf("Enter month (1-12): ");
    scanf("%d", &month);
    printf("Enter year: ");
    scanf("%d", &year);
    
    if (month < 1 || month > 12) {
        printf("Invalid month!\n");
        return 0;
    }
    
    switch (month) {
        case 1:
            printf("January %d has 31 days\n", year);
            break;
        case 2:
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                printf("February %d has 29 days (Leap Year)\n", year);
            } else {
                printf("February %d has 28 days\n", year);
            }
            break;
        case 3:
            printf("March %d has 31 days\n", year);
            break;
        case 4:
            printf("April %d has 30 days\n", year);
            break;
        case 5:
            printf("May %d has 31 days\n", year);
            break;
        case 6:
            printf("June %d has 30 days\n", year);
            break;
        case 7:
            printf("July %d has 31 days\n", year);
            break;
        case 8:
            printf("August %d has 31 days\n", year);
            break;
        case 9:
            printf("September %d has 30 days\n", year);
            break;
        case 10:
            printf("October %d has 31 days\n", year);
            break;
        case 11:
            printf("November %d has 30 days\n", year);
            break;
        case 12:
            printf("December %d has 31 days\n", year);
            break;
    }
    
    return 0;
}