#include <stdio.h>

int main() {
    int number;
    
    printf("Enter an integer: ");
    scanf("%d", &number);
    
    int temp = number;
    while (temp != 0) {
        if (temp % 2 == 0) {
            printf("%d is even\n", temp);
        } else {
            printf("%d is odd\n", temp);
        }
        temp--;
    }
    
    return 0;
}