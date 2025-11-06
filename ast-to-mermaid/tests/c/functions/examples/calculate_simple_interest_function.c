#include <stdio.h>

float simpleInterest(float principal, float rate, float time) {
    return (principal * rate * time) / 100;
}

int main() {
    float p = 1000.0, r = 5.0, t = 2.0;
    float interest = simpleInterest(p, r, t);
    printf("Simple Interest: %.2f\n", interest);
    printf("Total Amount: %.2f\n", p + interest);
    return 0;
}