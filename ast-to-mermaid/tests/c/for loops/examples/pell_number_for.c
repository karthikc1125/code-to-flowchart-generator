#include <stdio.h>

int main() {
    int n;
    long long prev2 = 0, prev1 = 1, current;
    
    printf("Enter the position of Pell number: ");
    scanf("%d", &n);
    
    if (n == 0) {
        printf("Pell number at position %d is %lld\n", n, prev2);
        return 0;
    } else if (n == 1) {
        printf("Pell number at position %d is %lld\n", n, prev1);
        return 0;
    }
    
    for (int i = 2; i <= n; i++) {
        current = 2 * prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    printf("Pell number at position %d is %lld\n", n, current);
    
    return 0;
}