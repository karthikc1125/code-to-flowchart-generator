#include <stdio.h>

int main() {
    int n, i = 0;
    
    printf("Enter the number of terms: ");
    scanf("%d", &n);
    
    do {
        long long catalan = 1;
        
        for (int j = 0; j < i; j++) {
            catalan = catalan * 2 * (2 * j + 1) / (j + 2);
        }
        
        printf("Catalan number C(%d) = %lld\n", i, catalan);
        i++;
    } while (i < n);
    
    return 0;
}