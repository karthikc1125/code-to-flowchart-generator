#include <stdio.h>

int main() {
    int rows;
    
    printf("Enter number of rows: ");
    scanf("%d", &rows);
    
    printf("Number pattern:\n");
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d ", j);
        }
        printf("\n");
    }
    
    return 0;
}