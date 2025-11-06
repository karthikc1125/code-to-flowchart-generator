#include <stdio.h>

int main() {
    int month, day;
    
    printf("Enter your birth month (1-12): ");
    scanf("%d", &month);
    
    printf("Enter your birth day (1-31): ");
    scanf("%d", &day);
    
    switch (month) {
        case 1:
            if (day <= 19) {
                printf("Your zodiac sign is Capricorn.\n");
            } else {
                printf("Your zodiac sign is Aquarius.\n");
            }
            break;
        case 2:
            if (day <= 18) {
                printf("Your zodiac sign is Aquarius.\n");
            } else {
                printf("Your zodiac sign is Pisces.\n");
            }
            break;
        case 3:
            if (day <= 20) {
                printf("Your zodiac sign is Pisces.\n");
            } else {
                printf("Your zodiac sign is Aries.\n");
            }
            break;
        case 4:
            if (day <= 19) {
                printf("Your zodiac sign is Aries.\n");
            } else {
                printf("Your zodiac sign is Taurus.\n");
            }
            break;
        case 5:
            if (day <= 20) {
                printf("Your zodiac sign is Taurus.\n");
            } else {
                printf("Your zodiac sign is Gemini.\n");
            }
            break;
        case 6:
            if (day <= 20) {
                printf("Your zodiac sign is Gemini.\n");
            } else {
                printf("Your zodiac sign is Cancer.\n");
            }
            break;
        case 7:
            if (day <= 22) {
                printf("Your zodiac sign is Cancer.\n");
            } else {
                printf("Your zodiac sign is Leo.\n");
            }
            break;
        case 8:
            if (day <= 22) {
                printf("Your zodiac sign is Leo.\n");
            } else {
                printf("Your zodiac sign is Virgo.\n");
            }
            break;
        case 9:
            if (day <= 22) {
                printf("Your zodiac sign is Virgo.\n");
            } else {
                printf("Your zodiac sign is Libra.\n");
            }
            break;
        case 10:
            if (day <= 22) {
                printf("Your zodiac sign is Libra.\n");
            } else {
                printf("Your zodiac sign is Scorpio.\n");
            }
            break;
        case 11:
            if (day <= 21) {
                printf("Your zodiac sign is Scorpio.\n");
            } else {
                printf("Your zodiac sign is Sagittarius.\n");
            }
            break;
        case 12:
            if (day <= 21) {
                printf("Your zodiac sign is Sagittarius.\n");
            } else {
                printf("Your zodiac sign is Capricorn.\n");
            }
            break;
        default:
            printf("Invalid month. Please enter a valid month (1-12).\n");
    }
    
    return 0;
}