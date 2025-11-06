#include <stdio.h>

int main() {
    int n, i = 1;
    float num, sum = 0.0, average;
    
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    
    if (n <= 0) {
        printf("Invalid number of elements.\n");
        return 1;
    }
    
    printf("Enter %d numbers:\n", n);
    while (i <= n) {
        printf("Enter number %d: ", i);
        scanf("%f", &num);
        sum += num;
        i++;
    }
    
    average = sum / n;
    printf("Average = %.2f\n", average);
    
    return 0;
}