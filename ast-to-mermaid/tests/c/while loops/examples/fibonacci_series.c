#include <stdio.h>

int main() {
    int n, first = 0, second = 1, next, i = 3;
    
    printf("Enter the number of terms: ");
    scanf("%d", &n);
    
    if (n >= 1) {
        printf("Fibonacci Series: %d ", first);
    }
    
    if (n >= 2) {
        printf("%d ", second);
    }
    
    while (i <= n) {
        next = first + second;
        printf("%d ", next);
        first = second;
        second = next;
        i++;
    }
    
    printf("\n");
    
    return 0;
}