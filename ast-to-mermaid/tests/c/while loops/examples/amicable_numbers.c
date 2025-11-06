#include <stdio.h>

int sumOfDivisors(int n) {
    int sum = 1, i = 2;
    while (i <= n/2) {
        if (n % i == 0) {
            sum += i;
        }
        i++;
    }
    return sum;
}

int main() {
    int num1, num2;
    
    printf("Enter two numbers: ");
    scanf("%d %d", &num1, &num2);
    
    int sum1 = sumOfDivisors(num1);
    int sum2 = sumOfDivisors(num2);
    
    if (sum1 == num2 && sum2 == num1) {
        printf("%d and %d are amicable numbers\n", num1, num2);
    } else {
        printf("%d and %d are not amicable numbers\n", num1, num2);
    }
    
    return 0;
}