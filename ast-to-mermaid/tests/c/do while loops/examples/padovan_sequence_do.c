#include <stdio.h>

int main() {
    int n, first = 1, second = 1, third = 1, next, i = 3;
    
    printf("Enter the number of terms: ");
    scanf("%d", &n);
    
    if (n >= 1) {
        printf("Padovan number P(0) = %d\n", first);
    }
    
    if (n >= 2) {
        printf("Padovan number P(1) = %d\n", second);
    }
    
    if (n >= 3) {
        printf("Padovan number P(2) = %d\n", third);
    }
    
    do {
        next = first + second;
        printf("Padovan number P(%d) = %d\n", i, next);
        first = second;
        second = third;
        third = next;
        i++;
    } while (i < n);
    
    return 0;
}