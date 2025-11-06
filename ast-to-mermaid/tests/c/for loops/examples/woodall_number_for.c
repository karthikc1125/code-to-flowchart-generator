#include <stdio.h>
#include <math.h>

int main() {
    int number, found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int n = 1; n <= number; n++) {
        long long woodall = n * pow(2, n) - 1;
        if (woodall == number) {
            found = 1;
            break;
        }
        if (woodall > number) {
            break;
        }
    }
    
    if (found) {
        printf("%d is a Woodall number\n", number);
    } else {
        printf("%d is not a Woodall number\n", number);
    }
    
    return 0;
}