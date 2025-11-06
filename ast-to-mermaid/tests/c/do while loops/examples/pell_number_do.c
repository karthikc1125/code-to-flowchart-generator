#include <stdio.h>

int main() {
    int n, first = 0, second = 1, next, i = 2;
    
    printf("Enter the number of terms: ");
    scanf("%d", &n);
    
    if (n >= 1) {
        printf("Pell number P(0) = %d\n", first);
    }
    
    if (n >= 2) {
        printf("Pell number P(1) = %d\n", second);
    }
    
    do {
        next = 2 * second + first;
        printf("Pell number P(%d) = %d\n", i, next);
        first = second;
        second = next;
        i++;
    } while (i < n);
    
    return 0;
}