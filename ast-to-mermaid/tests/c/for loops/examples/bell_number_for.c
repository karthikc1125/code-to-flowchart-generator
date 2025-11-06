#include <stdio.h>

int main() {
    int n;
    
    printf("Enter the position of Bell number: ");
    scanf("%d", &n);
    
    if (n < 0) {
        printf("Please enter a non-negative integer\n");
        return 1;
    }
    
    // Create a 2D array for Bell triangle
    int bell[100][100];
    bell[0][0] = 1;
    
    for (int i = 1; i <= n; i++) {
        // Explicitly fill for the first column
        bell[i][0] = bell[i-1][i-1];
        
        // Fill for remaining terms of row
        for (int j = 1; j <= i; j++) {
            bell[i][j] = bell[i-1][j-1] + bell[i][j-1];
        }
    }
    
    printf("Bell number at position %d is %d\n", n, bell[n][0]);
    
    return 0;
}