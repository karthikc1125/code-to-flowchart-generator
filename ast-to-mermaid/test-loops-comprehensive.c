#include <stdio.h>

int main() {
    int i = 0;
    
    // Simple while loop
    while (i < 2) {
        printf("While loop: %d\n", i);
        i++;
    }
    
    // While loop with break
    int j = 0;
    while (j < 5) {
        if (j == 2) {
            break;
        }
        printf("While with break: %d\n", j);
        j++;
    }
    
    // Do-while loop
    int k = 0;
    do {
        printf("Do-while loop: %d\n", k);
        k++;
    } while (k < 2);
    
    // Nested loops
    int m = 0;
    while (m < 2) {
        int n = 0;
        while (n < 2) {
            printf("Nested loops: %d, %d\n", m, n);
            n++;
        }
        m++;
    }
    
    printf("End\n");
    return 0;
}