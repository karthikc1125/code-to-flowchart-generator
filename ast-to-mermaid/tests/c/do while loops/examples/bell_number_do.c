#include <stdio.h>

int main() {
    int n, i = 0, j;
    
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    
    // Create a 2D array to store Bell triangle
    int bell[10][10];
    
    bell[0][0] = 1;
    
    do {
        bell[i+1][0] = bell[i][i];
        
        for (j = 0; j <= i; j++) {
            bell[i+1][j+1] = bell[i][j] + bell[i+1][j];
        }
        i++;
    } while (i < n);
    
    printf("The %d-th Bell number is %d\n", n, bell[n-1][0]);
    
    return 0;
}