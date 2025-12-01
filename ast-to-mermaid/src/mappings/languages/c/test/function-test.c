#include <stdio.h>

// Function declaration
int add(int a, int b);

// Function definition
int multiply(int x, int y) {
    return x * y;
}

// Recursive function
int factorial(int n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

int main() {
    int a = 5;
    int b = 3;
    
    // Function calls
    int sum = add(a, b);
    int product = multiply(a, b);
    int fact = factorial(a);
    
    printf("Sum: %d\n", sum);
    printf("Product: %d\n", product);
    printf("Factorial of %d: %d\n", a, fact);
    
    return 0;
}

// Function definition after main
int add(int a, int b) {
    return a + b;
}