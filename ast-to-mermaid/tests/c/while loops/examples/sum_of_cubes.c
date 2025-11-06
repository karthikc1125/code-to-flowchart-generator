#include <stdio.h>

int main() {
    int n, i = 1, sum = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    
    while (i <= n) {
        sum += i * i * i;
        i++;
    }
    
    printf("Sum of cubes from 1 to %d = %d\n", n, sum);
    
    return 0;
}