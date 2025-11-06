#include <stdio.h>

int main() {
    int number, digit, frequency = 0, remainder;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    printf("Enter a digit to find its frequency: ");
    scanf("%d", &digit);
    
    int temp = number;
    if (temp == 0 && digit == 0) {
        frequency = 1;
    }
    
    while (temp != 0) {
        remainder = temp % 10;
        if (remainder == digit) {
            frequency++;
        }
        temp /= 10;
    }
    
    printf("Frequency of %d in %d is %d\n", digit, number, frequency);
    
    return 0;
}