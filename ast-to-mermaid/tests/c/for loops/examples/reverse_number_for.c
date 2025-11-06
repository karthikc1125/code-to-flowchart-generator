#include <stdio.h>

int main() {
    int n, reversed = 0, remainder;
    
    printf("Enter an integer: ");
    scanf("%d", &n);
    
    for (int temp = n; temp != 0; temp /= 10) {
        remainder = temp % 10;
        reversed = reversed * 10 + remainder;
    }
    
    printf("Reversed Number = %d\n", reversed);
    
    return 0;
}