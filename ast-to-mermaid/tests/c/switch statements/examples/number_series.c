#include <stdio.h>

int main() {
    int choice, n;
    
    printf("Number Series Generator\n");
    printf("1. Even numbers\n2. Odd numbers\n3. Square numbers\n4. Cube numbers\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);
    printf("Enter number of terms: ");
    scanf("%d", &n);
    
    if (n <= 0) {
        printf("Invalid number of terms!\n");
        return 0;
    }
    
    switch (choice) {
        case 1:
            printf("First %d even numbers: ", n);
            for (int i = 1; i <= n; i++) {
                printf("%d ", 2 * i);
            }
            printf("\n");
            break;
        case 2:
            printf("First %d odd numbers: ", n);
            for (int i = 0; i < n; i++) {
                printf("%d ", 2 * i + 1);
            }
            printf("\n");
            break;
        case 3:
            printf("First %d square numbers: ", n);
            for (int i = 1; i <= n; i++) {
                printf("%d ", i * i);
            }
            printf("\n");
            break;
        case 4:
            printf("First %d cube numbers: ", n);
            for (int i = 1; i <= n; i++) {
                printf("%d ", i * i * i);
            }
            printf("\n");
            break;
        default:
            printf("Invalid choice!\n");
    }
    
    return 0;
}