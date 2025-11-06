#include <stdio.h>

int fibonacciRecursive(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

int main() {
    int n = 10;
    int result = fibonacciRecursive(n);
    printf("The %dth Fibonacci number (recursive) is %d\n", n, result);
    return 0;
}