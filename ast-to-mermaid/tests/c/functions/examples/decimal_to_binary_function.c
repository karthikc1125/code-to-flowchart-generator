#include <stdio.h>

void decimalToBinary(int n) {
    if (n == 0) {
        printf("0");
        return;
    }
    
    int binary[32];
    int i = 0;
    
    while (n > 0) {
        binary[i] = n % 2;
        n /= 2;
        i++;
    }
    
    printf("Binary: ");
    for (int j = i - 1; j >= 0; j--) {
        printf("%d", binary[j]);
    }
}

int main() {
    int number = 10;
    printf("Decimal %d in binary is ", number);
    decimalToBinary(number);
    printf("\n");
    return 0;
}