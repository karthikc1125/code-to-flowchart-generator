#include <stdio.h>

int main() {
    int number, digit, frequency[10] = {0};
    int isUnique = 1;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int temp = number; temp > 0; temp /= 10) {
        digit = temp % 10;
        frequency[digit]++;
        if (frequency[digit] > 1) {
            isUnique = 0;
        }
    }
    
    if (isUnique) {
        printf("%d has all unique digits\n", number);
    } else {
        printf("%d does not have all unique digits\n", number);
    }
    
    return 0;
}