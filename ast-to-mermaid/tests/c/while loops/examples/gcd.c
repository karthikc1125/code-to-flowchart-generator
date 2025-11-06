#include <stdio.h>

int main() {
    int num1, num2, gcd, i = 1;
    
    printf("Enter two integers: ");
    scanf("%d %d", &num1, &num2);
    
    while (i <= num1 && i <= num2) {
        if (num1 % i == 0 && num2 % i == 0) {
            gcd = i;
        }
        i++;
    }
    
    printf("GCD of %d and %d is %d\n", num1, num2, gcd);
    
    return 0;
}