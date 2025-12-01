#include <stdio.h>

int main() {
    int i = 0;
    
    // While loop
    while (i < 3) {
        printf("While loop: %d\n", i);
        i++;
    }
    
    // Do-while loop
    int j = 0;
    do {
        printf("Do-while loop: %d\n", j);
        j++;
    } while (j < 2);
    
    printf("End\n");
    return 0;
}