#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    
    int prev = 0, curr = 1, next;
    for (int i = 2; i <= n; i++) {
        next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

int main() {
    int n = 10;
    int result = fibonacci(n);
    printf("The %dth Fibonacci number is %d\n", n, result);
    return 0;
}