#include <stdio.h>

int main() {
    int day, month;
    
    printf("Enter your birth day (1-31): ");
    scanf("%d", &day);
    printf("Enter your birth month (1-12): ");
    scanf("%d", &month);
    
    if (day < 1 || day > 31 || month < 1 || month > 12) {
        printf("Invalid date!\n");
    } else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
        printf("Your zodiac sign: Aries\n");
    } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
        printf("Your zodiac sign: Taurus\n");
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
        printf("Your zodiac sign: Gemini\n");
    } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
        printf("Your zodiac sign: Cancer\n");
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
        printf("Your zodiac sign: Leo\n");
    } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
        printf("Your zodiac sign: Virgo\n");
    } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
        printf("Your zodiac sign: Libra\n");
    } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
        printf("Your zodiac sign: Scorpio\n");
    } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
        printf("Your zodiac sign: Sagittarius\n");
    } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
        printf("Your zodiac sign: Capricorn\n");
    } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
        printf("Your zodiac sign: Aquarius\n");
    } else {
        printf("Your zodiac sign: Pisces\n");
    }
    
    return 0;
}