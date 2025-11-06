#include <stdio.h>

int findMin(int arr[], int size) {
    int min = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1, 5};
    int size = sizeof(arr) / sizeof(arr[0]);
    int minimum = findMin(arr, size);
    printf("Minimum element in the array is %d\n", minimum);
    return 0;
}