#include <stdio.h>

int main() {
    int arr[10], n, choice, element, position;
    
    printf("Enter the number of elements (max 10): ");
    scanf("%d", &n);
    
    if (n <= 0 || n > 10) {
        printf("Invalid number of elements!\n");
        return 0;
    }
    
    printf("Enter %d elements: ", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("Array Operations:\n");
    printf("1. Insert element\n2. Delete element\n3. Search element\nEnter your choice: ");
    scanf("%d", &choice);
    
    if (choice == 1) {
        if (n >= 10) {
            printf("Array is full! Cannot insert more elements.\n");
        } else {
            printf("Enter element to insert: ");
            scanf("%d", &element);
            printf("Enter position (0-%d): ", n);
            scanf("%d", &position);
            
            if (position < 0 || position > n) {
                printf("Invalid position!\n");
            } else {
                // Shift elements to the right
                for (int i = n; i > position; i--) {
                    arr[i] = arr[i-1];
                }
                arr[position] = element;
                n++;
                printf("Element inserted successfully!\n");
            }
        }
    } else if (choice == 2) {
        printf("Enter position to delete (0-%d): ", n-1);
        scanf("%d", &position);
        
        if (position < 0 || position >= n) {
            printf("Invalid position!\n");
        } else {
            // Shift elements to the left
            for (int i = position; i < n-1; i++) {
                arr[i] = arr[i+1];
            }
            n--;
            printf("Element deleted successfully!\n");
        }
    } else if (choice == 3) {
        printf("Enter element to search: ");
        scanf("%d", &element);
        
        int found = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] == element) {
                printf("Element found at position %d\n", i);
                found = 1;
                break;
            }
        }
        
        if (!found) {
            printf("Element not found!\n");
        }
    } else {
        printf("Invalid choice!\n");
    }
    
    // Display final array
    printf("Final array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}