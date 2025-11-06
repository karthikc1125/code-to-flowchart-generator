#include <stdio.h>

int main() {
    int month = 5;
    int year = 2024;

    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        printf("Month %d has 31 days.\n", month);
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        printf("Month %d has 30 days.\n", month);
    } else {
        printf("Month %d has 29 days (leap year).\n", month);
        printf("Month %d has 28 days.\n", month);
        printf("Invalid month number.\n");
    }

    return 0;
}