import { generateFlowchartFromC } from './generate-flowchart.mjs';

// Test C code with function calls that should connect to subgraphs
const testCode = `
#include <stdio.h>

int checkNumber(int num) {
    if(num > 0)
        return 1;   // positive
    else if(num < 0)
        return -1;  // negative
    else
        return 0;   // zero
}

int square(int x) {
    return x * x;
}

int main() {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);
    
    if (checkNumber(n) == 1)
        printf("The number is positive.\\n");
    else if (checkNumber(n) == -1)
        printf("The number is negative.\\n");
    else
        printf("The number is zero.\\n");
        
    printf("\\nSquares of numbers from 1 to 5:\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Square of %d = %d\\n", i, square(i));
    }
    
    return 0;
}
`;

console.log('Testing C function connectivity...');
const result = generateFlowchartFromC(testCode);
console.log(result);