#include <stdio.h>

int main() {
    int n, choice;
    
    printf("Number Series Generator\n");
    printf("1. Even numbers\n2. Odd numbers\n3. Square numbers\n4. Cube numbers\nEnter your choice: ");
    scanf("%d", &choice);
    printf("Enter the number of terms: ");
    scanf("%d", &n);
    
    if (n <= 0) {
        printf("Invalid number of terms!\n");
    } else if (choice == 1) {
        printf("First %d even numbers: ", n);
        for (int i = 1; i <= n; i++) {
            printf("%d ", 2 * i);
        }
        printf("\n");
    } else if (choice == 2) {
        printf("First %d odd numbers: ", n);
        for (int i = 0; i < n; i++) {
            printf("%d ", 2 * i + 1);
        }
        printf("\n");
    } else if (choice == 3) {
        printf("First %d square numbers: ", n);
        for (int i = 1; i <= n; i++) {
            printf("%d ", i * i);
        }
        printf("\n");
    } else if (choice == 4) {
        printf("First %d cube numbers: ", n);
        for (int i = 1; i <= n; i++) {
            printf("%d ", i * i * i);
        }
        printf("\n");
    } else {
        printf("Invalid choice!\n");
    }
    
    return 0;
}