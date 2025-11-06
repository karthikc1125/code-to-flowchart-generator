#include <stdio.h>

int main() {
    int number, i = 0, found = 0;
    
    printf("Enter a number: ");
    scanf("%d", &number);
    
    do {
        if (i * (i + 1) == number) {
            found = 1;
            break;
        }
        i++;
    } while (i * (i + 1) <= number);
    
    if (found) {
        printf("%d is a Pronic number.\n", number);
    } else {
        printf("%d is not a Pronic number.\n", number);
    }
    
    return 0;
}