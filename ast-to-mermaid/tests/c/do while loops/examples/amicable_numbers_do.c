#include <stdio.h>

int sumOfDivisors(int n) {
    int sum = 1; // 1 is always a divisor
    int i = 2;
    do {
        if (n % i == 0) {
            sum += i;
        }
        i++;
    } while (i <= n / 2);
    
    return sum;
}

int main() {
    int num1, num2, sum1, sum2;
    
    printf("Enter two numbers: ");
    scanf("%d %d", &num1, &num2);
    
    sum1 = sumOfDivisors(num1);
    sum2 = sumOfDivisors(num2);
    
    if (sum1 == num2 && sum2 == num1) {
        printf("%d and %d are Amicable numbers.\n", num1, num2);
    } else {
        printf("%d and %d are not Amicable numbers.\n", num1, num2);
    }
    
    return 0;
}