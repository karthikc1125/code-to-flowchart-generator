#include <stdio.h>

int main() {
    int n, i, j;
    
    printf("Enter the position of Bell number: ");
    scanf("%d", &n);
    
    if (n < 0) {
        printf("Please enter a non-negative integer\n");
        return 1;
    }
    
    // Create a 2D array for Bell triangle
    int bell[100][100];
    bell[0][0] = 1;
    
    i = 1;
    while (i <= n) {
        // Explicitly fill for the first column
        bell[i][0] = bell[i-1][i-1];
        
        // Fill for remaining terms of row
        j = 1;
        while (j <= i) {
            bell[i][j] = bell[i-1][j-1] + bell[i][j-1];
            j++;
        }
        i++;
    }
    
    printf("Bell number at position %d is %d\n", n, bell[n][0]);
    
    return 0;
}