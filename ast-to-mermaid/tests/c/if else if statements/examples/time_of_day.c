#include <stdio.h>

int main() {
    int hour;
    
    printf("Enter hour (0-23): ");
    scanf("%d", &hour);
    
    if (hour < 0 || hour > 23) {
        printf("Invalid hour\n");
    } else if (hour < 12) {
        printf("Good Morning\n");
    } else if (hour < 18) {
        printf("Good Afternoon\n");
    } else {
        printf("Good Evening\n");
    }
    
    return 0;
}