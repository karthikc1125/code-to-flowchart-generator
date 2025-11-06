#include <stdio.h>

int main() {
    int hour = 14; // 24-hour format
    
    if (hour >= 5 && hour < 12) {
        printf("Good morning!\n");
    } else if (hour >= 12 && hour < 18) {
        printf("Good afternoon!\n");
    } else if (hour >= 18 && hour < 22) {
        printf("Good evening!\n");
    } else {
        printf("Good night!\n");
    }
    
    return 0;
}