#include <stdio.h>

int main() {
    int number, i = 1;
    
    printf("Enter a number to display its multiplication table: ");
    scanf("%d", &number);
    
    printf("Multiplication table of %d:\n", number);
    while (i <= 10) {
        printf("%d x %d = %d\n", number, i, number * i);
        i++;
    }
    
    return 0;
}