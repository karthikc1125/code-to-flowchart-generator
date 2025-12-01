#include <stdio.h>

// ----- User-Defined Functions -----

// Function to check if a number is positive, negative, or zero
int checkNumber(int num) {
    if(num > 0)
        return 1;   // positive
    else if(num < 0)
        return -1;  // negative
    else
        return 0;   // zero
}

// Function to calculate the square of a number
int square(int x) {
    return x * x;
}

// ----- Main Function -----
int main() {
    int n;

    printf("Enter a number: ");
    scanf("%d", &n);

    // Function call inside if condition
    if(checkNumber(n) == 1) {
        printf("The number is positive.\n");
    } 
    else if(checkNumber(n) == -1) {
        printf("The number is negative.\n");
    } 
    else {
        printf("The number is zero.\n");
    }

    // Function call inside for loop
    printf("\nSquares of numbers from 1 to 5:\n");
    for(int i = 1; i <= 5; i++) {
        printf("Square of %d = %d\n", i, square(i));
    }

    return 0;
}