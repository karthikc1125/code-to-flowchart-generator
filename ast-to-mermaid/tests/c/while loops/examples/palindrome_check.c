#include <stdio.h>

int main() {
    int number, reversed = 0, remainder, original;
    
    printf("Enter an integer: ");
    scanf("%d", &number);
    
    original = number;
    int temp = number;
    
    while (temp != 0) {
        remainder = temp % 10;
        reversed = reversed * 10 + remainder;
        temp /= 10;
    }
    
    if (original == reversed) {
        printf("%d is a palindrome.\n", original);
    } else {
        printf("%d is not a palindrome.\n", original);
    }
    
    return 0;
}