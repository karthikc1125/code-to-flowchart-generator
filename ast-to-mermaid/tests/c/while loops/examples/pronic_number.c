#include <stdio.h>

int main() {
    int number, i = 0, found = 0;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    while (i * (i + 1) <= number) {
        if (i * (i + 1) == number) {
            found = 1;
            break;
        }
        i++;
    }
    
    if (found) {
        printf("%d is a pronic number\n", number);
    } else {
        printf("%d is not a pronic number\n", number);
    }
    
    return 0;
}