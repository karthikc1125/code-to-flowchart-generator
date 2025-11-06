#include <stdio.h>

int main() {
    int number, count = 0;
    
    printf("Enter an integer: ");
    scanf("%d", &number);
    
    int temp = number;
    if (temp == 0) {
        count = 1;
    }
    
    while (temp != 0) {
        temp /= 10;
        count++;
    }
    
    printf("Number of digits in %d = %d\n", number, count);
    
    return 0;
}