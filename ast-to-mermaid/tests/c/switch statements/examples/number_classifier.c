#include <stdio.h>

int main() {
    int number, type;
    
    printf("Number Classifier\n");
    printf("Enter a number: ");
    scanf("%d", &number);
    
    if (number < 0) {
        type = 1;
    } else if (number == 0) {
        type = 2;
    } else if (number % 2 == 0) {
        type = 3;
    } else {
        type = 4;
    }
    
    switch (type) {
        case 1:
            printf("%d is a negative number\n", number);
            break;
        case 2:
            printf("%d is zero\n", number);
            break;
        case 3:
            printf("%d is a positive even number\n", number);
            break;
        case 4:
            printf("%d is a positive odd number\n", number);
            break;
    }
    
    return 0;
}