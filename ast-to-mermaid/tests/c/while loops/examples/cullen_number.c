#include <stdio.h>
#include <math.h>

int main() {
    int number, n = 0;
    int found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    while (n <= number) {
        long long cullen = n * pow(2, n) + 1;
        if (cullen == number) {
            found = 1;
            break;
        }
        if (cullen > number) {
            break;
        }
        n++;
    }
    
    if (found) {
        printf("%d is a Cullen number\n", number);
    } else {
        printf("%d is not a Cullen number\n", number);
    }
    
    return 0;
}