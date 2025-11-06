#include <stdio.h>
#include <math.h>

int countDigits(int n) {
    int count = 0;
    for (; n > 0; n /= 10) {
        count++;
    }
    return count;
}

int main() {
    int number, remainder, sum = 0, digits;
    
    printf("Enter a positive integer: ");
    scanf("%d", &number);
    
    digits = countDigits(number);
    int position = digits;
    
    for (int temp = number; temp > 0; temp /= 10) {
        remainder = temp % 10;
        sum += pow(remainder, position);
        position--;
    }
    
    if (sum == number) {
        printf("%d is a disarium number\n", number);
    } else {
        printf("%d is not a disarium number\n", number);
    }
    
    return 0;
}