#include <stdio.h>

int main() {
    int arr[100], size, min;
    
    printf("Enter the number of elements: ");
    scanf("%d", &size);
    
    printf("Enter %d elements: ", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }
    
    min = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    
    printf("Minimum element = %d\n", min);
    
    return 0;
}