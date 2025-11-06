#include <stdio.h>

int main() {
    int arr[100], size, max, i = 1;
    
    printf("Enter the number of elements: ");
    scanf("%d", &size);
    
    if (size <= 0) {
        printf("Invalid size.\n");
        return 1;
    }
    
    printf("Enter %d elements: ", size);
    scanf("%d", &arr[0]);
    max = arr[0];
    
    while (i < size) {
        scanf("%d", &arr[i]);
        if (arr[i] > max) {
            max = arr[i];
        }
        i++;
    }
    
    printf("Maximum element = %d\n", max);
    
    return 0;
}