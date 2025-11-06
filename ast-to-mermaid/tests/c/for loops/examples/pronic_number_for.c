#include <stdio.h>

int main() {
    int number, found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    for (int i = 0; i * (i + 1) <= number; i++) {
        if (i * (i + 1) == number) {
            found = 1;
            break;
        }
    }
    
    if (found) {
        printf("%d is a pronic number\n", number);
    } else {
        printf("%d is not a pronic number\n", number);
    }
    
    return 0;
}