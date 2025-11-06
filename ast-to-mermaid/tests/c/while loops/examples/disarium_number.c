#include <stdio.h>
#include <math.h>

int countDigits(int n) {
    int count = 0;
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}

int main() {
    int number, remainder, sum = 0, digits;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    digits = countDigits(number);
    int temp = number;
    int position = digits;
    
    while (temp > 0) {
        remainder = temp % 10;
        sum += pow(remainder, position);
        position--;
        temp /= 10;
    }
    
    if (sum == number) {
        printf("%d is a disarium number\n", number);
    } else {
        printf("%d is not a disarium number\n", number);
    }
    
    return 0;
}