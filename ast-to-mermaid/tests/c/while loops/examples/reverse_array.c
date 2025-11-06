#include <stdio.h>

int main() {
    int arr[100], size, i = 0;
    
    printf("Enter the number of elements: ");
    scanf("%d", &size);
    
    printf("Enter %d elements: ", size);
    while (i < size) {
        scanf("%d", &arr[i]);
        i++;
    }
    
    printf("Original array: ");
    i = 0;
    while (i < size) {
        printf("%d ", arr[i]);
        i++;
    }
    
    printf("\nReversed array: ");
    i = size - 1;
    while (i >= 0) {
        printf("%d ", arr[i]);
        i--;
    }
    printf("\n");
    
    return 0;
}