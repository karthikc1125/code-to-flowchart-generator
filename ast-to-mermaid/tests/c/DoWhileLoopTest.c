#include <stdio.h>

int main() {
    int i = 0;
    do {
        printf("Iteration: %d\n", i);
        i++;
    } while (i < 3);
    printf("Loop finished\n");
    return 0;
}