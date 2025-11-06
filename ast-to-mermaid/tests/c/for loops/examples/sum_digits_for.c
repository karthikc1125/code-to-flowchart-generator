#include <stdio.h>

int main() {
    int n, sum = 0, remainder;
    
    printf("Enter an integer: ");
    scanf("%d", &n);
    
    for (int temp = n; temp != 0; temp /= 10) {
        remainder = temp % 10;
        sum += remainder;
    }
    
    printf("Sum of digits = %d\n", sum);
    
    return 0;
}