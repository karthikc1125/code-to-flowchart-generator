#include <stdio.h>

int main() {
    int arr[100], size, max;
    
    printf("Enter the number of elements: ");
    scanf("%d", &size);
    
    printf("Enter %d elements: ", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }
    
    max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    printf("Maximum element = %d\n", max);
    
    return 0;
}