#include <stdio.h>

int main() {
    int n, i = 3;
    long long prev2 = 1, prev1 = 1, prev = 1, current;
    
    printf("Enter the position in Padovan sequence: ");
    scanf("%d", &n);
    
    if (n <= 2) {
        printf("Padovan number at position %d is 1\n", n);
        return 0;
    }
    
    while (i <= n) {
        current = prev2 + prev1;
        prev2 = prev1;
        prev1 = prev;
        prev = current;
        i++;
    }
    
    printf("Padovan number at position %d is %lld\n", n, current);
    
    return 0;
}