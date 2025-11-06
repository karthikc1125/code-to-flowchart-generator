#include <stdio.h>

long long catalan(int n) {
    if (n <= 1) return 1;
    
    long long result = 0;
    for (int i = 0; i < n; i++) {
        result += catalan(i) * catalan(n - i - 1);
    }
    return result;
}

int main() {
    int n;
    
    printf("Enter the position of Catalan number: ");
    scanf("%d", &n);
    
    if (n < 0) {
        printf("Please enter a non-negative integer\n");
        return 1;
    }
    
    printf("Catalan number at position %d is %lld\n", n, catalan(n));
    
    return 0;
}