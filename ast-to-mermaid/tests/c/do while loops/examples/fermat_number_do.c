#include <stdio.h>
#include <math.h>

int main() {
    int n, i = 0;
    
    printf("Enter the number of Fermat numbers to generate: ");
    scanf("%d", &n);
    
    do {
        long long fermat = pow(2, pow(2, i)) + 1;
        printf("Fermat number F(%d) = %lld\n", i, fermat);
        i++;
    } while (i < n);
    
    return 0;
}