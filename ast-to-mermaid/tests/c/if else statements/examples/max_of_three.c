#include <stdio.h>

int main() {
    int a = 10, b = 20, c = 15;
    int max;
    
    if (a >= b) {
        if (a >= c) {
            max = a;
        } else {
            max = c;
        }
    } else {
        if (b >= c) {
            max = b;
        } else {
            max = c;
        }
    }
    
    printf("Maximum of %d, %d, and %d is %d\n", a, b, c, max);
    
    return 0;
}