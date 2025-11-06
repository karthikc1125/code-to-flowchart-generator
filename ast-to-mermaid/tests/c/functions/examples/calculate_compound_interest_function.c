#include <stdio.h>
#include <math.h>

float compoundInterest(float principal, float rate, float time, int n) {
    return principal * pow((1 + rate / (n * 100)), n * time) - principal;
}

int main() {
    float p = 1000.0, r = 5.0, t = 2.0;
    int n = 4; // Compounded quarterly
    float interest = compoundInterest(p, r, t, n);
    printf("Compound Interest: %.2f\n", interest);
    printf("Total Amount: %.2f\n", p + interest);
    return 0;
}