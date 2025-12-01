#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

void greet() {
    printf("Hello! This is a function example.\n");
}

int main() {
    int x = 5;
    int y = 3;
    
    int sum = add(x, y);
    greet();
    
    printf("Sum: %d\n", sum);
    return 0;
}