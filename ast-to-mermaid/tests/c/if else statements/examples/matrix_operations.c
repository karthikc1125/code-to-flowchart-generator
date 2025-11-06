#include <stdio.h>

int main() {
    int matrix[3][3], rows = 3, cols = 3, choice;
    
    printf("Enter a 3x3 matrix:\n");
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            scanf("%d", &matrix[i][j]);
        }
    }
    
    printf("Matrix Operations:\n");
    printf("1. Check if diagonal matrix\n2. Check if identity matrix\n3. Find sum of diagonals\nEnter your choice: ");
    scanf("%d", &choice);
    
    if (choice == 1) {
        int isDiagonal = 1;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (i != j && matrix[i][j] != 0) {
                    isDiagonal = 0;
                    break;
                }
            }
            if (!isDiagonal) break;
        }
        
        if (isDiagonal) {
            printf("It is a diagonal matrix.\n");
        } else {
            printf("It is not a diagonal matrix.\n");
        }
    } else if (choice == 2) {
        int isIdentity = 1;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (i == j && matrix[i][j] != 1) {
                    isIdentity = 0;
                    break;
                } else if (i != j && matrix[i][j] != 0) {
                    isIdentity = 0;
                    break;
                }
            }
            if (!isIdentity) break;
        }
        
        if (isIdentity) {
            printf("It is an identity matrix.\n");
        } else {
            printf("It is not an identity matrix.\n");
        }
    } else if (choice == 3) {
        int primaryDiagonalSum = 0, secondaryDiagonalSum = 0;
        
        for (int i = 0; i < rows; i++) {
            primaryDiagonalSum += matrix[i][i];
            secondaryDiagonalSum += matrix[i][rows - 1 - i];
        }
        
        printf("Sum of primary diagonal: %d\n", primaryDiagonalSum);
        printf("Sum of secondary diagonal: %d\n", secondaryDiagonalSum);
    } else {
        printf("Invalid choice!\n");
    }
    
    return 0;
}