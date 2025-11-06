#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = 5;
    int target = 30;
    int found = 0;
    
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            printf("Element %d found at index %d\n", target, i);
            found = 1;
            break;
        }
    }
    
    if (!found) {
        printf("Element %d not found in the array\n", target);
    }
    
    return 0;
}