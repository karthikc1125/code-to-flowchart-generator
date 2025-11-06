#include <stdio.h>
#include <math.h>

int main() {
    int n, original, remainder, result = 0, count = 0;
    
    printf("Enter an integer: ");
    scanf("%d", &n);
    
    original = n;
    
    // Count number of digits
    for (int temp = n; temp != 0; temp /= 10) {
        count++;
    }
    
    // Check if it's an Armstrong number
    for (int temp = n; temp != 0; temp /= 10) {
        remainder = temp % 10;
        result += pow(remainder, count);
    }
    
    if (result == original) {
        printf("%d is an Armstrong number.\n", original);
    } else {
        printf("%d is not an Armstrong number.\n", original);
    }
    
    return 0;
}